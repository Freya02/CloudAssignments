FROM --platform=linux/amd64 python:3.12

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 10000

CMD ["python", "./container2.py"]
