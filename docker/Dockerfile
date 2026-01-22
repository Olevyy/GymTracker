# docker/Dockerfile
FROM python:3.13-slim

# Logs visible immediately
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend /app

RUN python manage.py collectstatic --noinput

# Run migrations and then start Gunicorn
CMD python manage.py migrate && exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 backend.wsgi:application
