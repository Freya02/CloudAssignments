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
    

    if not os.path.isfile("/freya_PV_dir/" + filename):
        return jsonify({
            "file": filename,
            "error": "File not found."
        })
    return

#endpoint test
@app.route("/calculate", methods=['POST'])
def calculate():
    parser_resp = validate_request(request.data)
    if parser_resp:
        return parser_resp
    resp = requests.post('http://container2-service/calculate', data=request.data)
    return resp.text


def store_file(data):
    storage_path = "C:/Users/FreyaV/Desktop/Container1Repo/freya-docker/freya_PV_dir/"
    try:
        data = json.loads(data)
        filename = data.get('file', None)
        file_data = data.get('data', None)


        if not filename:
            return jsonify({
                "file": None,
                "error": "Invalid JSON input."
            })


        if not file_data:
            return jsonify({
                "file": filename,
                "error": "Invalid JSON input."
            })


        current_directory = os.getcwd()
        print("Current working directory:", current_directory)

        with open(f"/freya_PV_dir/{filename}", 'w') as file:
            file.write(file_data + '\n') 

   
        return jsonify({
            "file": filename,
            "message": "Success."
        })
    except Exception as e:
        return jsonify({
            "file": filename,
            "error": current_directory
        })

#endpoint testtt
@app.route("/store-file", methods=['POST'])
def handle_store_file():

    response = store_file(request.data)
    return response

#test
if __name__ == '__main__':
    app.run(debug= True, host='0.0.0.0', port=6000)
