FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (required for Postgres, XGBoost, healthcheck, OpenSSL)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    openssl \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libxcb1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Generate self-signed SSL certificates for development
RUN mkdir -p certs && \
    openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem \
    -days 365 -nodes -subj "/C=US/ST=Dev/L=Dev/O=CrowdShield/CN=localhost"

# Expose HTTPS port
EXPOSE 8000

# Run the FastAPI server with SSL
CMD ["python", "main.py"]
