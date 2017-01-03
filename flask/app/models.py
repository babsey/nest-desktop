from app import db
from datetime import datetime

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64), index=True, unique=True)
#     email = db.Column(db.String(120), index=True, unique=True)
#     network = db.relationship('Network', backref='user', lazy='dynamic')
#
#     def __repr__(self):
#         return '<User %r>' % (self.name)

class Network(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime)
    nest_app = db.Column(db.String(32))
    name = db.Column(db.String(32))
    network = db.Column(db.String(5000))

    def __init__(self, nest_app, name='', network='{}'):
        self.timestamp = datetime.utcnow()
        self.nest_app = nest_app
        self.name = name
        self.network = network

    def __repr__(self):
        return '<Network %r>' % (self.id)
