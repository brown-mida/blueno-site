import json

import flask
import pytest

from main import app


def test_index():
    app.testing = True
    client = app.test_client()

    r = client.get('/')
    assert r.status_code == 200


# TODO: Move tests to their respective blueprint
def test_dimensions():
    from main import app
    app.testing = True
    client = app.test_client()
    r = client.get('/image/dimensions/L66E2921S3O1MURX')
    assert r.status_code == 200


@pytest.mark.skip(reason='Has a side-effect')
def test_roi():
    from main import app
    app.testing = True
    client = app.test_client()
    data = {
        'patient_id': 'abc',
        'created_by': 'pytest',
        'x1': -1,
        'x2': -1,
        'y1': -1,
        'y2': -1,
        'z1': -1,
        'z2': -1,
    }
    r = client.post('/roi',
                    data=json.dumps(data),
                    content_type='application/json')
    assert r.status_code == 200


@pytest.mark.skip(reason='Has a side-effect')
def test_create_model():
    from main import app
    app.testing = True
    client = app.test_client()
    data = {}
    r = client.post('/model',
                    data=json.dumps(data),
                    content_type='application/json')
    assert r.status_code == 200


def test_list_plots():
    from main import app
    app.testing = True
    client = app.test_client()
    r: flask.Response
    r = client.get('/plots')
    assert r.status_code == 200
    assert 'Matt_test_2-classes-2018-07-25T23:10:27.814299' in json.loads(
        r.data)


def test_list_transforms():
    from main import app
    app.testing = True
    client = app.test_client()
    r: flask.Response
    r = client.get('/preprocessing/transforms')
    assert r.status_code == 200
    assert 'bound_pixels' in json.loads(r.data)


@pytest.mark.skip(reason="Takes too long and wastes lots of $$")
def test_preprocess_data():
    from main import app
    app.testing = True
    client = app.test_client()
    r: flask.Response
    r = client.post('/preprocessing/<pytest>')
    assert r.status_code == 200
