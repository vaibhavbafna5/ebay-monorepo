from flask import Flask, send_from_directory, render_template
import json
import ebay_helpers
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static', static_url_path='/')
CORS(app)

# Get the absolute path to the directory containing this script
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load raw_products.json using the absolute path
raw_products_path = os.path.join(current_dir, "raw_products.json")

with open(raw_products_path, "r") as file:
    json_data = file.read()

products_data = json.loads(json_data)

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route("/api/get-raw-products", methods=["GET", "POST"])
def get_raw_products():
    return products_data

@app.route("/api/regenerate", methods=["GET", "POST"])
def regenerate():
    debug = True
    print("hello, regenerating")
    try:
        ebay_helpers.write_all_products_to_json_raw()
        return {"status": "successfully regenerating"}
    except Exception:
        return {"status": "failure"}

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=6001)