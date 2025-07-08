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
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
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

deploy_install_docker() {
    echo -e "${CYAN}Installing Docker on the remote server...${NC}"
    _get_deploy_params
    local SSH_COMMAND="ssh -p ${SSH_DEPLOY_PORT} ${DEPLOY_USER}@${SERVER_IP}"

    echo -e "${YELLOW}Running commands on ${DEPLOY_USER}@${SERVER_IP}...${NC}"
    $SSH_COMMAND "sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg"
    $SSH_COMMAND "sudo install -m 0755 -d /etc/apt/keyrings"
    $SSH_COMMAND "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg"
    $SSH_COMMAND "sudo chmod a+r /etc/apt/keyrings/docker.gpg"
    $SSH_COMMAND "echo \"deb [arch=\"$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \"$(lsb_release -cs)\" stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null"
    $SSH_COMMAND "sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
    $SSH_COMMAND "sudo usermod -aG docker ${DEPLOY_USER}"
    $SSH_COMMAND "sudo systemctl enable docker.service"
    $SSH_COMMAND "sudo systemctl enable containerd.service"

    echo -e "${GREEN}✓ Docker installation commands sent. Please log out and log back into your SSH session on the server for group changes to take effect.${NC}"
}

deploy_app_placeholder() {
    echo -e "${YELLOW}This is a placeholder for deploying the application.${NC}"
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
            "Install Docker on Server"
            "Deploy Application (placeholder)"
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
                4) deploy_install_docker; break ;;
                5) deploy_app_placeholder; break ;;
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
