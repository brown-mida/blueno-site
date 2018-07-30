"""
Responsible for the routes related to the /trainer endpoint.

"""
import csv
import io
import types
from concurrent.futures import ThreadPoolExecutor

import flask
import requests
from google.cloud import storage

import blueno

app_train = flask.Blueprint('app_train', __name__)

client = storage.Client(project='elvo-198322')
# TODO(luke): Start splitting the development/private bucket from the public
# TODO(luke): Also start considering user-specific buckets.
priv_bucket = client.bucket('elvos')
pub_bucket = client.bucket('elvos-public')

executor = ThreadPoolExecutor(2)


@app_train.route('/model', methods=['POST'])
def create_model():
    data = flask.json.dumps(flask.request.get_json())
    response = requests.post('http://104.196.51.205:8080/api/experimental/'
                             'dags/train_model/dag_runs',
                             json={'conf': data})
    return response.content, response.status_code, response.headers.items()


@app_train.route('/plots')
def list_plots():
    """
    Gets all available plots.

    :return: a JSON object containing the gs urls of the available plots.
    """
    plots = set()

    blob: storage.Blob
    for blob in pub_bucket.list_blobs(prefix='plots/'):
        plot_dir = blob.name.split('/')[1]
        if not plot_dir.startswith('test_'):
            plots.add(plot_dir)
    return flask.json.jsonify(sorted(plots))


@app_train.route('/data')
def list_datasets():
    """
    Gets all available datasets.

    :return: a JSON object containing the gs urls of the available plots.
    """
    datasets = set()

    blob: storage.Blob
    for blob in pub_bucket.list_blobs(prefix='processed/'):
        data_name = blob.name.split('/')[1]
        if not data_name.startswith('test'):
            datasets.add(data_name)
    return flask.json.jsonify(sorted(datasets))


@app_train.route('/data/<data_name>')
def get_images(data_name: str):
    """
    Returns the image names (ex. 0ABCSDFS.png) which have the given data name

    :return:
    """
    images = []

    blob: storage.Blob
    for blob in pub_bucket.list_blobs(prefix=f'processed/{data_name}/'):
        filename = blob.name.split('/')[-1]
        images.append(filename)
    return flask.json.jsonify(sorted(images))


@app_train.route('/data/<data_name>/labels')
def get_labels(data_name: str):
    """
    Returns labels corresponding to the images.

    :return:
    """

    blob: storage.Blob
    for blob in priv_bucket.list_blobs(prefix=f'processed/{data_name}/'):
        filename = blob.name.split('/')[-1]
        if filename.endswith('.csv'):
            byte_stream = io.BytesIO()
            blob.download_to_file(byte_stream)
            byte_stream.seek(0)
            unicode_stream = [line.decode('utf8') for line in byte_stream]
            csv_reader = csv.DictReader(unicode_stream)
            # TODO(luke): Not all upload CSV labels files will have these
            # field names
            patient_infos = [row for row in csv_reader]
            return flask.json.jsonify(sorted(patient_infos,
                                             key=lambda x: x['Anon ID']))


@app_train.route('/preprocessing/transforms', methods=['GET'])
def list_transforms():
    """
    Returns transforms in blueno.transforms

    :return: all functions in blueno.transforms
    """
    transforms = [attr_name for attr_name in dir(blueno.transforms)
                  if isinstance(getattr(blueno.transforms, attr_name),
                                types.FunctionType)]
    return flask.json.jsonify(transforms)


@app_train.route('/preprocessing/<data_name>', methods=['POST'])
def preprocess_data(data_name: str):
    """
    Processes the images using the preprocessing functions defined in
    the payload, saving the output in gs://elvos-public/processed/data_name.

    :param data_name:
    :return:
    """
    data = flask.request.get_json()

    for _ in priv_bucket.list_blobs(prefix=f'processed/{data_name}/'):
        message = f'Directory {data_name} already exists'
        response = flask.json.jsonify({'message': message})
        response.status_code = 422
        return response

    data['data_name'] = data_name
    data_json = flask.json.dumps(data)
    response = requests.post('http://104.196.51.205:8080/api/experimental/'
                             'dags/preprocess_web/dag_runs',
                             json={'conf': data_json})
    return response.content, response.status_code, response.headers.items()


@app_train.route('/preprocessing/<data_name>/count', methods=['GET'])
def count_data(data_name: str):
    """
    Processes the images using the preprocessing functions defined in
    the payload, saving the output in gs://elvos-public/processed/data_name.

    :param data_name:
    :return:
    """
    count = len(
        [1 for _ in priv_bucket.list_blobs(prefix=f'processed/{data_name}/')])

    return flask.json.jsonify({'count': count})
