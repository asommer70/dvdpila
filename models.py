from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
SQLALCHEMY_TRACK_MODIFICATIONS = False


class Dvd(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), unique=False, nullable=False)
    rating = db.Column(db.Integer)
    abstract_txt = db.Column(db.Text)
    abstract_source = db.Column(db.String(255))
    abstract_url = db.Column(db.String(255))
    image_url = db.Column(db.String(255))
    file_url = db.Column(db.String(255))
    playback_time = db.Column(db.Integer)

    def __repr__(self):
        return '<Dvd %r>' % self.title


class Episode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    file_url = db.Column(db.String(255))
    playback_time = db.Column(db.Integer)
    dvd_id = db.Column(db.Integer, db.ForeignKey('dvd.id'))

    def __repr__(self):
        return '<Episode %r>' % self.name


class Bookmark(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    dvd_id = db.Column(db.Integer, db.ForeignKey('dvd.id'))
    episode_id = db.Column(db.Integer, db.ForeignKey('episode.id'))

    def __repr__(self):
        return '<Bookmark %r>' % self.name


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)


tags = db.Table(
    'tags',
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True),
    db.Column('dvd_id', db.Integer, db.ForeignKey('dvd.id'), primary_key=True)
)
