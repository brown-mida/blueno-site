import logging
import os

import dotenv
import flask
import flask_cors

dotenv.load_dotenv(verbose=True)

from .routes.annotator import app_annotate  # noqa: E402
from .routes.preprocess import app_preprocess  # noqa: E402
from .routes.train import app_train  # noqa: E402
from .routes.new_annotator import app_annotate_new  # noqa: E402

app = flask.Flask(__name__,
                  template_folder='../build',
                  static_folder='../build/static',
                  static_url_path='/static')
app.register_blueprint(app_preprocess)
app.register_blueprint(app_train)
app.register_blueprint(app_annotate)
app.register_blueprint(app_annotate_new)
flask_cors.CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    # To avoid errors, run `yarn build` to generate build/index.html
    return flask.render_template('index.html')


@app.route('/service-worker.js')
def service_worker():
    return flask.helpers.send_file(
        os.path.join(app.template_folder, 'service-worker.js'))


def configure_logger():
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)

    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)


@app.errorhandler(500)
def server_error(e):
    logging.exception('An error occurred during a request.')
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500


if __name__ == '__main__':
    # This is used when running locally. Gunicorn is used to run the
    # application on Google App Engine. See entrypoint in app.yaml.
    configure_logger()
    app.run(host='127.0.0.1', port=8080, debug=True)
