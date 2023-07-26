from flask_sqlalchemy import SQLAlchemy
import rollcal_prediction_server as server
import os


db = SQLAlchemy(server.app)


class Subscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    endpoint = db.Column(db.String(300), nullable=False)
    p256dh = db.Column(db.String(150), nullable=False)
    auth = db.Column(db.String(100), nullable=False)

    def convert_to_json(self) -> dict:
        return {
            "endpoint" : self.endpoint,
            "keys" : {
                "p256dh" : self.p256dh,
                "auth" : self.auth
            }
        }

    def __repr__(self) -> str:
        return f"<Subscribers {id}>"



with server.app.app_context():
    if os.path.exists("./database.db") is False:
        db.create_all()

if __name__ == "__main__":
    with server.app.app_context():
        print(Subscribers.query.get_or_404(1).convert_to_json())