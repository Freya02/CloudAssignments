from flask import Flask, jsonify
from flask import request
import json
import os
import requests

app = Flask(__name__)

def validate_request(data):
    data = json.loads(data)
    print(data)
    filename = data.get('file', None)

 

    # check is filename is present
    if not filename:
        return jsonify({
            "file": None,
            "error": "Invalid JSON input."
        })
    
    # check if files exists
    if not os.path.isfile("/tmp/" + filename):
        return jsonify({
            "file": filename,
            "error": "File not found."
        })
    return


@app.route("/calculate", methods=['POST'])
def calculate():
    parser_resp = validate_request(request.data)
    if parser_resp:
        return parser_resp
    resp = requests.post('http://container2:10000/aggregate', data=request.data)
    return resp.json()


if __name__ == '__main__':
    app.run(debug= True, host='0.0.0.0', port=6000)
