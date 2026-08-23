#!/bin/bash
# Generate self-signed SSL certificates for local development
# Run this once to create certs/cert.pem and certs/key.pem

CERT_DIR="certs"
DAYS=365

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/cert.pem" ] || [ ! -f "$CERT_DIR/key.pem" ]; then
    echo "Generating self-signed SSL certificates..."
    openssl req -x509 -newkey rsa:4096 -keyout "$CERT_DIR/key.pem" -out "$CERT_DIR/cert.pem" \
        -days $DAYS -nodes -subj "/C=US/ST=Dev/L=Dev/O=CrowdShield/CN=localhost"
    echo "Certificates generated in $CERT_DIR/"
else
    echo "Certificates already exist in $CERT_DIR/"
fi
