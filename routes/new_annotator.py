import datetime
import logging

import flask
import gspread
import io
import matplotlib
import numpy as np
import os
from google.cloud import storage
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from oauth2client.service_account import ServiceAccountCredentials
from skimage import measure
from werkzeug.contrib.cache import SimpleCache

from utils import gcs, transforms
from utils.mongodb import get_db

matplotlib.use('Agg')
from matplotlib import pyplot as plt, image  # noqa: E402

cache = SimpleCache(threshold=3, default_timeout=0)

app_annotate_new = flask.Blueprint('app_annotate_new', __name__)


@app_annotate_new.route('/annotator/create-annotation-group', methods=['POST'])
def create_annotation_group():
    data = flask.request.get_json()

    if 'user' not in data:
        return flask.json.jsonify({'error': 'User not specified'})

    if 'name' not in data:
        return flask.json.jsonify({'error': 'Annotation name not specified'})

    if 'type' not in data:
        return flask.json.jsonify({'error': 'Annotation type not specified'})

    db = get_db(db='annotation_groups')
    try:
        # Save user-file relationship in MongoDB
        dataset = {
            "user": data['user'],
            "name": data['name'],
            "type": data['type']
        }
        db.replace_one({'user': data['user'], 'name': data['name']},
                       dataset, upsert=True)
        return flask.json.jsonify({'status': 'success'})
    except Exception as e:
        return flask.json.jsonify({'error': e})


@app_annotate_new.route('/annotator/get-annotation-groups', methods=['GET'])
def get_annotation_list():
    user = flask.request.args.get('user')

    db = get_db(db='annotation_groups')
    results = db.find({'user': user})
    data = []
    for doc in results:
        data.append({'user': doc['user'],
                     'name': doc['name'],
                     'type': doc['type']})
    return flask.json.jsonify({'data': data})


@app_annotate_new.route('/annotator/get-annotation-type', methods=['GET'])
def get_annotation_type():
    user = flask.request.args.get('user')
    group = flask.request.args.get('group')
    logging.info(group)

    db = get_db(db='annotation_groups')
    results = db.find_one({'user': user, 'name': group})
    data = {'type': results['type']}
    return flask.json.jsonify({'data': data})


@app_annotate_new.route('/annotator/get-annotations', methods=['GET'])
def get_annotations():
    user = flask.request.args.get('user')
    group = flask.request.args.get('group')

    db = get_db(db='annotation_groups')
    results = db.find({'user': user, 'group': group})
    data = {}
    for doc in results:
        data[doc['user']] = doc['label']
    return flask.json.jsonify({'data': data})


@app_annotate_new.route('/annotator/get-image-slice', methods=['GET'])
def get_image_slice():
    user = flask.request.args.get('user')
    image_id = flask.request.args.get('id')
    image_type = flask.request.args.get('type')
    image_slice = flask.request.args.get('slice')

    arr = _retrieve_arr(user, image_id)
    if image_type == 'axial':
        if arr.shape[0] <= int(image_slice):
            return flask.json.jsonify({'error': 'Slice out of bounds'})
        return _send_slice(arr[int(image_slice), :, :])
    elif image_type == 'coronal':
        if arr.shape[1] <= int(image_slice):
            return flask.json.jsonify({'error': 'Slice out of bounds'})
        return _send_slice(arr[:, int(image_slice), :])
    elif image_type == 'sagittal':
        if arr.shape[2] <= int(image_slice):
            return flask.json.jsonify({'error': 'Slice out of bounds'})
        return _send_slice(arr[:, :, int(image_slice)])
    elif image_type == 'axial_mip':
        if arr.shape[0] <= int(image_slice):
            return flask.json.jsonify({'error': 'Slice out of bounds'})
        arr = transforms.mip_slice(arr, int(image_slice), index=0)
        return _send_slice(arr)


@app_annotate_new.route('/annotator/get-image-dimensions', methods=['GET'])
def get_image_dimensions():
    user = flask.request.args.get('user')
    image_id = flask.request.args.get('id')

    arr = _retrieve_arr(user, image_id)
    if arr is None:
        return flask.json.jsonify({'error': 'ID does not exist'})
    return flask.json.jsonify({
        'data': {
            'x': arr.shape[1],
            'y': arr.shape[2],
            'z': arr.shape[0]
        }
    })


def _retrieve_arr(user, patient_id):
    cached_arr = cache.get('{}-{}'.format(user, patient_id))
    if cached_arr is not None:
        logging.debug('loading {} from cache'.format(patient_id))
        return cached_arr
    client = gcs.authenticate()
    bucket = client.get_bucket('blueno-ml-files')
    logging.debug('Downloading {} from GCS'.format(patient_id))
    arr = gcs.download_array('{}/default/{}.npy'.format(user, patient_id),
                             bucket)
    if arr is None:
        raise ValueError(
            'Blob with patient id {} does not exist'.format(patient_id))
    cache.set('{}-{}'.format(user, patient_id), arr)
    return arr


def _send_slice(arr):
    out_stream = io.BytesIO()
    image.imsave(out_stream,
                 arr,
                 cmap='gray',
                 format='png')
    out_stream.seek(0)
    return flask.send_file(out_stream, mimetype='image/png')
