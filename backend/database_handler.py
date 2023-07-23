from flask_sqlalchemy import SQLAlchemy
import rollcal_prediction_server as server
import os

server.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(server.app)


class Subscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test = db.Column(db.String(100), nullable=False)

    def __repr__(self) -> str:
        return f"<Subscribers {id}>"

with server.app.app_context():
    if os.path.exists("./database.db") is False:
        db.create_all()
