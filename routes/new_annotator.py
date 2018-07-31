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

from utils import gcs, preprocess, dbx
from utils.mongodb import get_db

matplotlib.use('Agg')
from matplotlib import pyplot as plt, image  # noqa: E402

client = storage.Client(project='elvo-198322')
bucket = client.bucket('elvos')

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


