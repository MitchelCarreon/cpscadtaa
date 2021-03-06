##  **Deployment** 

- **Get zip file** of latest branch
- **Create** a new **GitHub repository** (i.e., ```git init```) and push source code from zip.
- Run ```heroku git:remote -a example-app``` and ```git push```
- Then, make the following changes:
  - In ***app.py***, add the following line: *app = Flask(__name__, static_folder='frontend/build' static_url_path='')*
  - In ***routes.py***, add: *def serve(): return send_from_directory(app.static_folder, 'index.html')*
  - In ***frontend/package.json***, change proxy to name of heroku domain (*https://cpsc-adtaa.herokuapp.com/*).
  - In ***frontend/.gitignore***, comment out */build* 
  - In ***.flaskenv***, do *FLASK_ENV=production* from *FLASK_ENV=development*
  - In the ***root folder***, create a Procfile (i.e., ```touch Procfile```) and add *web: gunicorn* ***routes:app*** (make this point to the Flask object)

- Finally, run the following:
```
npm run build
git push heroku main
```

References:
- Deploying flask-react app in heroku [YouTube tutorial](https://youtu.be/h96KP3JMX7Q?t=784)
- Deploying flask-react app in heroku [article tutorial](https://towardsdatascience.com/build-deploy-a-react-flask-app-47a89a5d17d9)
- Heroku deployment [docs](https://devcenter.heroku.com/articles/git) 

### ***Making modifications to the app*** 

- To modify deployed app:
  - In ***.flaskenv***, change *FLASK_ENV* from *production* to *development*
  - In **frontend/package.json**, change proxy to *localhost:5000*
  - In **app.py**, change *app.config[SQLALCHEMY_DATABASE_URI"]* to local SQLite database.
  - Then run, ```npm run build``` (Otherwise, changes wont reflect in UI or in database)

- After modifications:
  - In ***.flaskenv***, change *FLASK_ENV* from *development* to *production*
  - In ***frontend/package.json***, change proxy back to domain name
  - In **app.py**, change *app.config[SQLALCHEMY_DATABASE_URI"]* to PostgreSQL DATABASE_URL from heroku (```heroku config --app cpsc-adtaa```).
  - Run, ```npm run build```
  - In ***frontend/build***, place required files for dead-end-pages 
  - Save changes in GitHub and heroku repos:
  
  ```
  git push heroku main
  git push origin main
  ```
### ***Process in migrating from SQLite to PostgreSQL***

- Create PostgreSQL DB in Heroku via ```heroku addons:create heroku-postgresql:<plan-name> --app <app-name> ```
- Get *DATABASE_URL* via ```heroku config --app <app-name>```. NOTE: Change *postgre* to *postgresql* as indicated [here](https://stackoverflow.com/questions/62688256/sqlalchemy-exc-nosuchmoduleerror-cant-load-plugin-sqlalchemy-dialectspostgre).
- In **app.py**,  change *app.config[SQLALCHEMY_DATABASE_URI"]* to retrieved *DATABASE_URL*.
- Initialize database with defined tables via ```heroku run python manage.py```

## **Setup**

### **Setting up (Windows)**

Inside VSCode, open 2 terminals. One for frontend (```cd frontend```), one for backend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python -m venv venv
venv/Scripts/activate
```
- Install dependencies/libraries (*Optional* - check if correct dependencies already exist ```pip list``` or ```python -m pip list```)
```
pip install -r requirements.txt
```

- Run the backend

``` 
python -m flask run 
``` 
or 
``` flask run ```

In "Frontend terminal", install dependencies and run:
```
npm install
npm start
```

------------------------------------------
### **Setting up (MacOS)** 

Inside VSCode, open 2 terminals. One for frontend (```cd frontend```), one for backend.

In "Backend terminal":
- Create a virtual environment (venv) and activate it
```
python3 -m venv venv
source venv/bin/activate
```

- (*Optional*) Ensure you have Homebrew installed (```brew --version```). Otherwise, do:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

- Install *node* and *mysql* (frontend and backend dependency requirements)
```
brew install node
brew install mysql
```



- (*Optional*) Install dependencies if they don't exist (```pip list``` to check):
``` 
pip install -r requirements.txt 
```

- Run the backend: 

```
flask run
```


In "Frontend terminal", install dependencies and run:

- (*Optional*) Ensure you have Homebrew installed (```brew --version```). Same in backend setup (If you've done this already, skip this part). Otherwise, do:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

- Install node (same in backend setup. skip if done)

```
brew install node
```

- Run the frontend:
```
npm install
npm start
```

## ***Issues*** 

***Import could not be resolved from source***
- Inside VSCode command palette (```Ctrl + Shift + P```), find *Python: Select Interpeter*
- Select, *Enter interpreter path*
- Navigate to and select *CPSC-ADTAA/venv/Scripts/python.exe*

**Could not proxy request to...**
- In frontend folder, package.json, change localhost to 127.0.0.1 (For Mac)


***No pyvenv.cfg***
- Create a virtual environment and activate
``` 
python -m venv venv
venv/Scripts/activate
```

***database errors***

- Initialize database: 

```python manage.py```

- Deleting database entries:

Comment out *db.create_all()*. Uncomment *db.drop_all* (in manage.py)
Then, ```python manage.py```

Or, use *DB Browser for SQLite* to execute SQL statements.

***Testing email confirmation***

Create mailtrap account. The free version only.
In app.py:
- Change *app.config['MAIL_USERNAME]* and *app.config['MAIL_PASSWORD']* to your mailtrap credentials (SMTP Settings > Integrations > Flask-Mail


***SQLite vs. PostgreSQL (Diff with original repo)***

Changes to the *SetupSectionsPage* and *SectionForm* (post-presentation):

- **During development (orig repo)**, *SQLite* was used and datetime was stored as CST.
- **After deployment**, *SQLite* can still be used for local testing. datetime is stored as UTC but converted to CST in the frontend.
- Using **PostgreSQL**, datetime is stored as UTC but converted to CST in the frontend.
