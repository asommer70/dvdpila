from dotenv import load_dotenv
from flask import Flask
from flask import url_for
from flask import render_template
import os
from models import db, Dvd, Episode, Bookmark, Tag


load_dotenv()


# app = Flask(__name__, static_url_path='/assets', static_folder='assets')
app = Flask(__name__)
# engine = create_engine(
#    "postgresql+psycopg2://scott:tiger@localhost/test",
#    isolation_level="SERIALIZABLE",
# )
db_user = os.getenv('DB_USER')
db_pass = os.getenv('DB_PASS')
db_con = f"postgresql+psycopg2://{db_user}:{db_pass}@localhost/dvdpila"
app.config['SQLALCHEMY_DATABASE_URI'] = db_con
# db = SQLAlchemy(app)
db.init_app(app)




@app.route("/")
def hello_world():
    url_for('static', filename='style.css')
    dvd = Dvd.query.first()
    return render_template('index.html', dvd=dvd)
