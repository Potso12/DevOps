FROM python:3

WORKDIR /usr/src/app

COPY ./service1.py ./service1.py
COPY ./requirements.txt ./requirements.txt


RUN pip install --no-cache-dir -r requirements.txt


CMD ["python", "service1.py"]