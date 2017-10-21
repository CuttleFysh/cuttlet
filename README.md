# Cuttlet

This is the repository for cuttlebay.com development.

## Missing in this readme

This readme is meant to be updated

```
As this is only a template
```

## How to Stage for Production
1. Create a copy of master in a local staging folder.
2. Change branch to production.
3. Change api keys in:
....* cuttlet_home/static/js/base.js -- TWITCH_CLIENT_ID & YOUTUBE_API_KEY
....* cuttlet_home/static/js/home.js -- client_id
....* cuttlet_home/static/js/twitch_login_account.js -- client_id
....* cuttlet_home/static/js/youtube_login_account.js -- response['aud']
4. Change all redirect urls to production url
....* cuttlet_home/static/js/home.js
5. Add new apps to INSTALLED_APPS in production cuttlet/settings.py
6. From production to staging folder add and remove duplicates:
....* All migration folders.
....* From ./cuttlet settings.py wsgi.py __init__.py
....* .gitignore
....* app.yaml
....* README.md
....* requirements.txt
....* remove all /__pycache__
....* remove all migrations from new apps folders
....* copy home/static main folder
7. Copy all elements of staging folder to production
8. Open cmd and run ./cloud_sql_proxy -instances="cuttlet-166523:us-west1:cuttlet-postgres"=tcp:3337 (find a port that can listen)
9. run python manage.py makemigrations
10. run python manage.py migrate
11. run python manage.py collectstatic
12. Check all static files created are the correct.
13. Optimize home/static/js/* files in clouse http://closure-compiler.appspot.com/ (simple)
14. run gsutil rsync -R static/ gs://cuttlet-bucket/static
15. Make sure port in settings is 5432
16. run gcloud app deploy
17. If deploy is successfull commit in git

### Last updated Oct 20, 2017
