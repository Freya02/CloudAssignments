FROM --platform=linux/amd64 python:3.12

COPY . .

RUN pip install -r requirements.txt

EXPOSE 6000

CMD ["python", "./container1.py"]
