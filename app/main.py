from flask import Flask, render_template, request
from flask_wtf.csrf import CSRFProtect
from .yadisk_scripts import write_file, upload_file
import requests
import time


# App Init
app = Flask(__name__)
app.config["SECRET_KEY"] = '\x81\n\xf0P\x9e\x8a\xe0u"\xce\xd4]\xd6Fn\xc90\xb2+2\xf3\xec\x92G'
csrf = CSRFProtect(app)
csrf.init_app(app)

# HomePage
@app.route("/", methods=['post', 'get'])
def home():
    if request.method == "POST":
        # write data to exel file and upload it
        wax = request.form.get("wax")
        telegram = request.form.get("telegram")
        twitter = request.form.get("twitter")
        email = request.form.get("email")
        table_path = './app/whitelist/whitelist.xlsx'
        write_file(table_path, [telegram, wax, twitter, email], "Sheet1")
        upload_file(table_path, "/PopitApp/whitelist.xlsx")
    return render_template("index.html", csrf=csrf)

# AccountPage
@app.route("/account")
def account():
    userName = request.args.get("name")
    schema_name = request.args.get("schema_name")
    if schema_name:
        resp = requests.get(f"https://wax.api.atomicassets.io/atomicassets/v1/accounts/{userName}/popitgameccg").json()
        return render_template("account.html", name=userName, templates=resp["data"]["templates"])
    return render_template("account.html", name=userName)


