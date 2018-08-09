import dotenv
import flask

from .train import app_train


def setup_module():
    dotenv.load_dotenv()


def test_get_labels():
    app = flask.Flask(__name__)
    app.register_blueprint(app_train)
    client = app.test_client()

    res: flask.Response
    res = client.get('/data/processed-lower/labels')
    assert res.status_code == 200
    assert len(res.get_json()) == 1019
