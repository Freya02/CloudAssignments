from flask import Flask, jsonify, request
import json
import pandas as pd

app = Flask(__name__)

def is_csv_format(content):
    print(content)
    for line in content.splitlines():
        print(line)
    
        if ',' not in line:
            return False
    return True


def get_aggregation(data):
    filename = data.get('file', None)
    product = data.get('product', None)


    if not filename.strip():
        return '{\n "file": "null",\n "error": "Invalid JSON input."\n}'

    try:
        with open(f"/freya_PV_dir/{filename}", 'r') as file:
            content = file.read()

        if not is_csv_format(content):
            return '{{\n "file": "{0}",\n "error": "Input file not in CSV format."\n}}'.format(filename)

        df = pd.read_csv(f"/freya_PV_dir/{filename}")

        required_columns = {'product', 'amount'}
        stripped_columns = {col.strip() for col in df.columns}

        if not required_columns.issubset(stripped_columns):
            return '{{\n "file": "{0}",\n "error": "Input file not in CSV format."\n}}'.format(filename)
        
        df.rename(columns=lambda x: x.strip(), inplace=True)

        df['amount'] = pd.to_numeric(df['amount'])

    
        if product:
            df = df[df['product'] == product]

        total_sum = df['amount'].sum()

        return '{{\n "file": "{0}",\n "sum": {1}\n}}'.format(filename, total_sum)


    except Exception as e:
        return '{{\n "file": "{0}",\n "error": "{1}"\n}}'.format(filename, str(e))
#endpoint testing
@app.route("/calculate", methods=['POST'])
def calculate():
    data = json.loads(request.data)
    resp = get_aggregation(data)
    return resp

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)
