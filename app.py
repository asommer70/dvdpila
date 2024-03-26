from dotenv import load_dotenv
from flask import Flask
# from flask_debugtoolbar import DebugToolbarExtension
from flask_migrate import Migrate
from flask import url_for
from flask import render_template
import os
from models import db, Dvd, Episode, Bookmark, Tag


load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = 'yahchu2aXil2'
# toolbar = DebugToolbarExtension(app)
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_con = f"postgresql+psycopg2://{db_user}:{db_pass}@localhost/dvdpila"
app.config['SQLALCHEMY_DATABASE_URI'] = db_con
db.init_app(app)
migrate = Migrate(app, db)


# import pdb; pdb.set_trace()


@app.route("/")
def hello_world():
    url_for('static', filename='style.css')
    dvd = Dvd.query.first()
    # import pdb; pdb.set_trace()
    return render_template('index.html', dvd=dvd)
