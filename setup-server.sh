#!/bin/bash
# This script is executed on the remote server

# Set working directory
cd /opt/chillteacher

# Load environment variables from .env file if it exists
if [ -f ".env" ]; then
    echo "Loading environment variables from .env file..."
    set -o allexport
    source .env
    set +o allexport
    echo "Environment variables loaded successfully!"
else
    echo "Warning: .env file not found. Using default environment variables."
fi

# Install Docker if not already present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    # Determine OS (Debian/Ubuntu)
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo "Could not determine OS. Using default setup for Debian."
        OS="debian"
    fi
    
    # Install necessary packages
    apt-get update
    apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common
    
    # Clean up old Docker repositories and GPG keys
    rm -f /etc/apt/sources.list.d/docker*.list
    sed -i '/download.docker.com/d' /etc/apt/sources.list 2>/dev/null
    rm -f /usr/share/keyrings/docker-archive-keyrings.gpg
    if command -v apt-key &> /dev/null; then
        apt-key del 0EBFCD88 2>/dev/null || true
    fi
    
    # Add Docker GPG key and repository based on OS
    if [ "$OS" = "ubuntu" ]; then
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    else
        curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    fi
    
    # Update and install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl enable docker
    systemctl start docker
    
    echo "Docker installed successfully!"
fi

if [ "$1" = "rebuild" ]; then
    echo "Loading Docker image..."
    docker load < chillteacher-image.tar.gz
    rm chillteacher-image.tar.gz
    echo "Docker image loaded and tar file removed."
fi

# Create persistent data directories for Caddy
echo "Creating persistent data directories for Caddy..."
mkdir -p ./caddy_data

# Bring up the application with Docker Compose
echo "Starting application with Docker Compose..."
docker compose up -d

echo "Restarting Caddy to apply new configuration..."
docker compose restart caddy

echo "Current working directory: $(pwd)"
echo "Directory contents:"
ls -la

# Check container status
echo "Checking container status..."
docker compose ps

# Check logs of nextjs-app container
echo "Checking logs of nextjs-app container..."
docker compose logs nextjs-app 2>&1 | tail -n 20

# Check logs of caddy container
echo "Checking logs of caddy container..."
docker compose logs caddy 2>&1 | tail -n 20

# Clean up unused Docker images (dangling)
echo "Cleaning up old Docker images..."
docker image prune -f

# Clean up unused volumes
echo "Cleaning up unused volumes..."
docker volume prune -f

echo "Server setup and deployment complete!"
