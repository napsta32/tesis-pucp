FROM python:3.10-alpine3.17

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
ENV PYTHONUNBUFFERED=1
