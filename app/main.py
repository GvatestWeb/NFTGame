from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route("/")
@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/account")
def account():
    userName = request.args.get("name")
    return render_template("account.html", name=userName)