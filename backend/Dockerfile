# FROM python:3.10 AS builder
FROM python:3.10-slim

WORKDIR /server

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# FROM python:3.10-slim

# WORKDIR /server

# COPY --from=builder /server /server

# RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "server/manage.py", "runserver", "0.0.0.0:8000"]
