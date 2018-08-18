from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class CategoricalLabel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer,
                         db.ForeignKey('label_group.id'),
                         nullable=False)
    value = db.Column(db.String(255), nullable=False)


class Annotation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer,
                         db.ForeignKey('label_group.id'),
                         nullable=False)
    x1 = db.Column(db.Float, nullable=False)
    x2 = db.Column(db.Float, nullable=False)
    y1 = db.Column(db.Float, nullable=False)
    y2 = db.Column(db.Float, nullable=False)
    z1 = db.Column(db.Float, nullable=False)
    z2 = db.Column(db.Float, nullable=False)


class LabelGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)


class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer,
                         db.ForeignKey('image_group.id'),
                         nullable=False)
    gcs_url = db.Column(db.String(255), nullable=False)


class ImageGroup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dataset_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(255), nullable=False)


class Dataset(db.Model):
    """A dataset consists of one or more image sets and
    one or more label sets.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
