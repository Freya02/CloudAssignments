from flask import Flask, jsonify
from flask import request
import json
import os
import pandas as pd
import csv

app = Flask(__name__)


def parse_csv(content):
    rows = content.split('\n')
    headers = rows[0].split(',')
    header_length = len(headers)
    for row in rows[1:]:
        row = row.split(',')
        if len(row) != header_length:
            raise Exception('Invalid CSV')
    return True

def get_aggregation(data):
    filename = data.get('file', None)
    product = data.get('product', None)
    

    if not filename.lower().endswith('.csv') and not filename.lower().endswith('.dat')  and not filename.lower().endswith('.yml'):
        return jsonify({
            "file": filename,
            "error": "Input file not in CSV format."
        })

    try:
        df = pd.read_csv("/tmp/" + filename)
        df = df.groupby(['product']).sum()
        df = df.loc[product]
        return jsonify({
            "file": filename,
            "sum": int(df['amount'])
        })
    except Exception as e:
        return jsonify({
            "file": filename,
            "error": "Input file not in CSV format."
        })


@app.route("/aggregate", methods=['POST'])
def aggregate():
    if request.method == 'POST':
        data = json.loads(request.data)
        resp = get_aggregation(data)
        return resp
    return jsonify({
        "file": None,
        "error": "Something went wrong"
    })


if __name__ == '__main__':
    app.run(debug= True, host='0.0.0.0', port=10000)


