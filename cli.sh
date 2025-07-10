#!/bin/bash

# cli.sh
# CLI tool for managing the ChillTeacher v2 project

# --- Configuration ---
# Source .env if it exists and export variables
if [ -f ".env" ]; then
    echo -e "\033[0;36mLoading environment variables from .env file...\033[0m"
    set -o allexport
    source .env
    set +o allexport
fi

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Helper Functions ---
print_header() {
    echo -e "${BLUE}=== ChillTeacher v2 CLI ===${NC}"
    echo
}

_get_deploy_params() {
    # Use existing environment variables if set, otherwise prompt with defaults
    read -p "Enter server IP address (default: ${SERVER_IP:-none}): " SERVER_IP_INPUT
    SERVER_IP="${SERVER_IP_INPUT:-$SERVER_IP}"
    read -p "Enter SSH username (default: ${DEPLOY_USER:-root}): " USERNAME_INPUT
    DEPLOY_USER="${USERNAME_INPUT:-$DEPLOY_USER}"
    read -p "Enter SSH port (default: ${SSH_DEPLOY_PORT:-22}): " SSH_PORT_INPUT
    SSH_DEPLOY_PORT="${SSH_PORT_INPUT:-$SSH_DEPLOY_PORT}"
}

# --- Target Functions ---
run_dev() {
    echo -e "${CYAN}Starting the app in development mode (with Turbopack)...${NC}"
    npm run fast
}

run_build() {
    echo -e "${CYAN}Building the app for production...${NC}"
    npm run build
    echo -e "${GREEN}✓ Build complete${NC}"
}

run_start() {
    echo -e "${CYAN}Starting the production server...${NC}"
    npm run start
}

run_lint() {
    echo -e "${CYAN}Linting the code...${NC}"
    npm run lint
}

run_format() {
    echo -e "${CYAN}Checking code formatting...${NC}"
    npm run format
}

run_format_fix() {
    echo -e "${CYAN}Fixing code formatting...${NC}"
    npm run format:fix
    echo -e "${GREEN}✓ Formatting fixed${NC}"
}

# --- Deployment Functions ---
deploy_generate_key() {
    echo -e "${CYAN}Generating SSH key...${NC}"
    if [ -f ~/.ssh/id_rsa ]; then
        echo -e "${YELLOW}SSH key already exists at ~/.ssh/id_rsa. Skipping generation.${NC}"
    else
        ssh-keygen -t rsa -b 4096
        echo -e "${GREEN}✓ SSH key generated successfully!${NC}"
    fi
}

deploy_copy_key() {
    echo -e "${CYAN}Copying SSH key to server...${NC}"
    _get_deploy_params
    echo -e "${YELLOW}Attempting to copy key to ${DEPLOY_USER}@${SERVER_IP} on port ${SSH_DEPLOY_PORT}...${NC}"
    ssh-copy-id -p "$SSH_DEPLOY_PORT" "${DEPLOY_USER}@${SERVER_IP}"
    echo -e "${GREEN}✓ SSH key copied successfully!${NC}"
}

deploy_test_conn() {
    echo -e "${CYAN}Testing SSH connection...${NC}"
    _get_deploy_params
    echo -e "${YELLOW}Testing connection to ${DEPLOY_USER}@${SERVER_IP} on port ${SSH_DEPLOY_PORT}...${NC}"
    ssh -p "$SSH_DEPLOY_PORT" "${DEPLOY_USER}@${SERVER_IP}" "echo -e '${GREEN}✓ SSH connection successful!${NC}'"
}

deploy_app_with_docker() {
    echo -e "${CYAN}Initiating Docker deployment to server...${NC}"
    _get_deploy_params

    local SERVER_IP="${SERVER_IP}"
    local USERNAME="${DEPLOY_USER}"
    local SSH_PORT="${SSH_DEPLOY_PORT}"

    local REMOTE_DIR="/opt/chillteacher"
    local PROJECT_ROOT="$(pwd)"

    # Setup SSH Control Master for connection reuse
    local SSH_CONTROL_PATH="/tmp/ssh_mux_%h_%p_%r"
    local SSH_OPTS="-o ControlMaster=auto -o ControlPath=$SSH_CONTROL_PATH -o ControlPersist=1h -o StrictHostKeyChecking=accept-new"
    local SSH_CMD="ssh $SSH_OPTS -p $SSH_PORT $USERNAME@$SERVER_IP"
    local SCP_CMD="scp -P $SSH_PORT $SSH_OPTS"

    echo -e "${BLUE}=== DEPLOYING CHILLTEACHER V2 ===${NC}"
    echo -e "${YELLOW}Server IP: ${SERVER_IP}${NC}"
    echo -e "${YELLOW}Username: ${USERNAME}${NC}"
    echo -e "${YELLOW}SSH Port: ${SSH_PORT}${NC}"
    echo -e "${YELLOW}Remote Directory: ${REMOTE_DIR}${NC}"
    echo ""

    # Create remote directory
    echo -e "${BLUE}Creating remote directory on server...${NC}"
    $SSH_CMD "mkdir -p $REMOTE_DIR"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error creating remote directory!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Remote directory created successfully!${NC}"

    # Build Docker image locally
    echo -e "${BLUE}Building Docker image locally...${NC}"
    docker build -t chillteacher-v2-app:latest $PROJECT_ROOT
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error building Docker image!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker image built successfully!${NC}"

    # Save Docker image to a tar file
    echo -e "${BLUE}Saving Docker image to tar file...${NC}"
    local_tar_path="$PROJECT_ROOT/chillteacher-v2-app.tar.gz"
    docker save chillteacher-v2-app:latest | gzip > "$local_tar_path"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error saving Docker image!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker image saved successfully!${NC}"

    # Copy files to server
    echo -e "${BLUE}Copying files to server...${NC}"
    $SCP_CMD "$local_tar_path" "$USERNAME@$SERVER_IP:$REMOTE_DIR/chillteacher-image.tar.gz"
    $SCP_CMD "$PROJECT_ROOT/docker-compose.yml" "$USERNAME@$SERVER_IP:$REMOTE_DIR/"
    $SCP_CMD "$PROJECT_ROOT/Caddyfile" "$USERNAME@$SERVER_IP:$REMOTE_DIR/"
    $SCP_CMD "$PROJECT_ROOT/setup-server.sh" "$USERNAME@$SERVER_IP:$REMOTE_DIR/"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error copying files to server!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Files copied successfully!${NC}"

    # Make setup-server.sh executable on remote
    echo -e "${BLUE}Making setup-server.sh executable on remote...${NC}"
    $SSH_CMD "chmod +x $REMOTE_DIR/setup-server.sh"

    # Run setup-server.sh on remote
    echo -e "${BLUE}Running setup-server.sh on remote server...${NC}"
    $SSH_CMD "cd $REMOTE_DIR && ./setup-server.sh"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error running setup script on server!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Server setup and deployment initiated successfully!${NC}"

    # Clean up local tar file
    echo -e "${BLUE}Cleaning up local tar file...${NC}"
    rm -f "$local_tar_path"

    # Close SSH Control Master connection
    echo -e "${BLUE}Closing SSH connection...${NC}"
    ssh $SSH_OPTS -p $SSH_PORT -O exit $USERNAME@$SERVER_IP

    echo -e "${GREEN}=== DEPLOYMENT COMPLETE! ===${NC}"
    echo -e "${YELLOW}Application should be running at: https://${SERVER_IP} (or your domain if configured).${NC}"
}

check_logs() {
    echo -e "${CYAN}Checking Docker container logs on the server...${NC}"
    _get_deploy_params

    local SERVER_IP="${SERVER_IP}"
    local USERNAME="${DEPLOY_USER}"
    local SSH_PORT="${SSH_DEPLOY_PORT}"
    local REMOTE_DIR="/opt/chillteacher"

    local SSH_CMD="ssh -p $SSH_PORT $USERNAME@$SERVER_IP"

    echo -e "${BLUE}Tailing logs from docker-compose on ${SERVER_IP}...${NC}"
    $SSH_CMD "cd $REMOTE_DIR && docker-compose logs -f --tail=100"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error checking logs on server! Make sure the app is deployed and running.${NC}"
        return 1
    fi
}

# --- Setup Functions ---
setup_env() {
    if [ -f ".env" ]; then
        echo -e "${YELLOW}.env file already exists. Skipping creation.${NC}"
    else
        echo -e "${CYAN}Creating .env file from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created successfully. Please fill it with your secrets.${NC}"
    fi
}

# --- Menu Functions ---
show_project_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Project Commands ---${NC}"
        local options=(
            "Run (Development)"
            "Build (Production)"
            "Start (Production)"
            "Lint Code"
            "Check Formatting"
            "Fix Formatting"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Project action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) run_dev; break ;;
                2) run_build; break ;;
                3) run_start; break ;;
                4) run_lint; break ;;
                5) run_format; break ;;
                6) run_format_fix; break ;;
                $((${#options[@]}))) return ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Please try again.${NC}"
                    break
                    ;;
            esac
        done
    done
}

show_deployment_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- VPS Server Setup & Deployment ---${NC}"
        local options=(
            "Generate SSH Key (local)"
            "Copy SSH Key to Server"
            "Test SSH Connection"
            "Deploy Application with Docker"
            "Check Docker Logs"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Deployment action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) deploy_generate_key; break ;;
                2) deploy_copy_key; break ;;
                3) deploy_test_conn; break ;;
                4) deploy_app_with_docker; break ;;
                5) check_logs; break ;;
                $((${#options[@]}))) return ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Please try again.${NC}"
                    break
                    ;;
            esac
        done
    done
}

show_setup_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Project Setup ---${NC}"
        local options=(
            "Create .env file"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Setup action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) setup_env; break ;;
                $((${#options[@]}))) return ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Please try again.${NC}"
                    break
                    ;;
            esac
        done
    done
}

# --- Main Menu ---
main_menu() {
    while true; do
        print_header
        echo -e "${BOLD}${MAGENTA}Select a category:${NC}"
        COLUMNS=1
        PS3="Enter your choice (0 to clear, q to quit): "
        local main_options=(
            "Project Commands"
            "Deployment"
            "Setup"
            "Quit"
        )
        select opt in "${main_options[@]}"; do
            if [[ "$REPLY" == "q" || "$REPLY" == "Q" ]]; then
                echo -e "${GREEN}Exiting CLI. Goodbye!${NC}"; exit 0
            fi

            case $REPLY in
                0) clear; break ;;
                1) show_project_menu; break ;;
                2) show_deployment_menu; break ;;
                3) show_setup_menu; break ;;
                $((${#main_options[@]}))) echo -e "${GREEN}Exiting CLI. Goodbye!${NC}"; exit 0 ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Type 'q' or the number for 'Quit' to exit.${NC}"
                    break
                    ;;
            esac
        done
    done
}

# --- Entry Point ---
main_menu