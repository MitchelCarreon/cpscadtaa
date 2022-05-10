# Import the required libraries
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy import true

from flask_jwt_extended import JWTManager

from datetime import datetime, timedelta, timezone
from flask_mail import Mail

# Create various application instances
# Order matters: Initialize SQLAlchemy before Marshmallow
db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
cors = CORS()
mail = Mail()

def create_app():
    """Application-factory pattern"""
    app = Flask(__name__, static_folder='frontend/build', static_url_path='')

    # local database
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db" 

    # heroku postgresql database
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://dgrxigikmujzqq:672400b26c8e4a9ee69ea7d4718df9747cbe618853d09f1a4996989be93499cc@ec2-52-71-69-66.compute-1.amazonaws.com:5432/d517mnv8c964qq"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # for login and registration, respectively.
    app.config["JWT_SECRET_KEY"] = "super-secret"  # TODO: Change this!
    app.config["SECRET_KEY"] = "super-secret" # TODO: Change this too!
    # jwt = JWTManager(app)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    # app.config['MAIL_SERVER'] = 'smtp.mailtrap.io'

    # EMAIL CONFIGURATIONS
    
    # email-config for testing
    # app.config['MAIL_SERVER'] = 'smtp.mailtrap.io'
    # app.config['MAIL_PORT'] = 2525
    # app.config['MAIL_USERNAME'] = '33acc45e679867'
    # app.config['MAIL_PASSWORD'] = '11626d76e96b23'
    # app.config['MAIL_USE_TLS'] = True
    # app.config['MAIL_USE_SSL'] = False

    # email-config for deployment
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USERNAME'] = 'cpscadtaa@gmail.com'
    app.config['MAIL_PASSWORD'] = 'uaomhcin4392'
    app.config['MAIL_USE_TLS'] = False
    app.config['MAIL_USE_SSL'] = True

    # TODO: Make a gmail account for this app. Use gmail to handle sending email.
    # app.config['MAIL_SERVER']='smtp.gmail.com'
    # app.config['MAIL_PORT'] = 465
    # app.config['MAIL_USERNAME'] = 'your_email@gmail.com'
    # app.config['MAIL_PASSWORD'] = 'your_password'
    # app.config['MAIL_USE_TLS'] = False
    # app.config['MAIL_USE_SSL'] = True

    # Initialize extensions
    # To use the application instances above, instantiate with an application:
    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)
    cors.init_app(app)

    mail.init_app(app)

    return app
