#!/bin/bash

# cli.sh
# CLI tool for managing the ChillTeacher v2 project

# --- Configuration ---
# Environment loading function
load_environment() {
    local env_type="${1:-local}"
    
    case "$env_type" in
        "local"|"dev"|"development")
            if [ -f ".env.local" ]; then
                echo -e "\033[0;36mLoading local development environment from .env.local...\033[0m"
                set -o allexport
                source .env.local
                set +o allexport
                export ENV_TYPE="local"
            elif [ -f ".env" ]; then
                echo -e "\033[0;36mLoading environment from .env file...\033[0m"
                set -o allexport
                source .env
                set +o allexport
                export ENV_TYPE="local"
            else
                echo -e "\033[1;33mWarning: No .env.local or .env file found. Using defaults.\033[0m"
                export ENV_TYPE="local"
            fi
            ;;
        "prod"|"production")
            if [ -f ".env.prod" ]; then
                echo -e "\033[0;36mLoading production environment from .env.prod...\033[0m"
                set -o allexport
                source .env.prod
                set +o allexport
                export ENV_TYPE="production"
            else
                echo -e "\033[1;33mWarning: No .env.prod file found. Using defaults.\033[0m"
                export ENV_TYPE="production"
            fi
            ;;
        *)
            echo -e "\033[0;31mError: Unknown environment type '$env_type'. Using local.\033[0m"
            load_environment "local"
            ;;
    esac
}

# Load local environment by default
load_environment "local"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    
    # Ensure we're using local environment for development
    if [ "$ENV_TYPE" != "local" ]; then
        echo -e "${YELLOW}Switching to local environment for development...${NC}"
        load_environment "local"
    fi
    
    # Check if development database is running
    if ! docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        echo -e "${YELLOW}Development database is not running. Starting it now...${NC}"
        docker_dev_up
        if [ $? -ne 0 ]; then
            echo -e "${RED}Failed to start development database. Please check the logs.${NC}"
            return 1
        fi
        # Give database a moment to fully start
        echo -e "${BLUE}Waiting for database to be ready...${NC}"
        sleep 3
    else
        echo -e "${GREEN}✓ Development database is already running${NC}"
    fi
    
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

deploy() {
    echo -e "${CYAN}Initiating deployment to server...${NC}"
    
    # Switch to production environment for deployment
    if [ "$ENV_TYPE" != "production" ]; then
        echo -e "${YELLOW}Switching to production environment for deployment...${NC}"
        load_environment "production"
    fi
    
    _get_deploy_params

    local SERVER_IP="${SERVER_IP}"
    local USERNAME="${DEPLOY_USER}"
    local SSH_PORT="${SSH_DEPLOY_PORT}"
    local REMOTE_DIR="/opt/chillteacher"
    local PROJECT_ROOT="$(pwd)"
    local SSH_CMD="ssh -p $SSH_PORT $USERNAME@$SERVER_IP"
    local SCP_CMD="scp -P $SSH_PORT"
    
    local rebuild_image=""
    while [[ "$rebuild_image" != "y" && "$rebuild_image" != "n" ]]; do
        read -p "Rebuild Docker image? (y/n): " rebuild_image
    done

    local setup_arg="no-rebuild"
    if [ "$rebuild_image" = "y" ]; then
        setup_arg="rebuild"
        # Build Docker image locally
        echo -e "${BLUE}Building Docker image locally...${NC}"
        docker build -t chillteacher-v2-app:latest $PROJECT_ROOT
        if [ $? -ne 0 ]; then echo -e "${RED}Error building Docker image!${NC}"; exit 1; fi
        echo -e "${GREEN}✓ Docker image built successfully!${NC}"

        # Save Docker image to a tar file
        echo -e "${BLUE}Saving Docker image to tar file...${NC}"
        local_tar_path="$PROJECT_ROOT/chillteacher-v2-app.tar.gz"
        docker save chillteacher-v2-app:latest | gzip > "$local_tar_path"
        if [ $? -ne 0 ]; then echo -e "${RED}Error saving Docker image!${NC}"; exit 1; fi
        echo -e "${GREEN}✓ Docker image saved successfully!${NC}"

        # Copy image to server
        echo -e "${BLUE}Copying image to server...${NC}"
        $SCP_CMD "$local_tar_path" "$USERNAME@$SERVER_IP:$REMOTE_DIR/chillteacher-image.tar.gz"
        if [ $? -ne 0 ]; then echo -e "${RED}Error copying image to server!${NC}"; exit 1; fi
        echo -e "${GREEN}✓ Image copied successfully!${NC}"
        
        # Clean up local tar file
        echo -e "${BLUE}Cleaning up local tar file...${NC}"
        rm -f "$local_tar_path"
    fi

    # Copy deployment files
    echo -e "${BLUE}Copying deployment files to server...${NC}"
    $SCP_CMD "$PROJECT_ROOT/docker-compose.prod.yml" "$USERNAME@$SERVER_IP:$REMOTE_DIR/docker-compose.yml"
    $SCP_CMD "$PROJECT_ROOT/.env.prod" "$USERNAME@$SERVER_IP:$REMOTE_DIR/.env"
    $SCP_CMD "$PROJECT_ROOT/Caddyfile" "$USERNAME@$SERVER_IP:$REMOTE_DIR/"
    $SCP_CMD "$PROJECT_ROOT/setup-server.sh" "$USERNAME@$SERVER_IP:$REMOTE_DIR/"
    if [ $? -ne 0 ]; then echo -e "${RED}Error copying deployment files to server!${NC}"; exit 1; fi
    echo -e "${GREEN}✓ Deployment files copied successfully!${NC}"

    # Run setup-server.sh on remote
    echo -e "${BLUE}Running setup-server.sh on remote server...${NC}"
    $SSH_CMD "chmod +x $REMOTE_DIR/setup-server.sh && cd $REMOTE_DIR && ./setup-server.sh $setup_arg"
    if [ $? -ne 0 ]; then echo -e "${RED}Error running setup script on server!${NC}"; exit 1; fi

    echo -e "${GREEN}=== DEPLOYMENT COMPLETE! ===${NC}"
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
    $SSH_CMD "cd $REMOTE_DIR && docker compose logs -f --tail=100"

    if [ $? -ne 0 ]; then
        echo -e "${RED}Error checking logs on server! Make sure the app is deployed and running.${NC}"
        return 1
    fi
}

# --- Docker Compose Functions ---
docker_dev_up() {
    echo -e "${CYAN}Starting development database with Docker Compose...${NC}"
    if [ ! -f "docker-compose.dev.yml" ]; then
        echo -e "${RED}Error: docker-compose.dev.yml not found!${NC}"
        return 1
    fi
    
    # Ensure we're using local environment
    if [ "$ENV_TYPE" != "local" ]; then
        echo -e "${YELLOW}Switching to local environment for development...${NC}"
        load_environment "local"
    fi
    
    # Check if .env.local file exists
    if [ ! -f ".env.local" ]; then
        echo -e "${YELLOW}Warning: .env.local file not found. Creating from .env.local.example...${NC}"
        setup_env_local
    fi
    
    docker-compose -f docker-compose.dev.yml up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Development database started successfully!${NC}"
        echo -e "${BLUE}Database is running on localhost:5432${NC}"
        echo -e "${BLUE}You can connect with: psql -h localhost -U ${POSTGRES_USER:-user} -d ${POSTGRES_DB:-mydatabase}${NC}"
    else
        echo -e "${RED}Error starting development database!${NC}"
        return 1
    fi
}

docker_dev_down() {
    echo -e "${CYAN}Stopping development database...${NC}"
    docker-compose -f docker-compose.dev.yml down
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Development database stopped successfully!${NC}"
    else
        echo -e "${RED}Error stopping development database!${NC}"
        return 1
    fi
}

docker_dev_status() {
    echo -e "${CYAN}Checking development database status...${NC}"
    docker-compose -f docker-compose.dev.yml ps
}

docker_dev_logs() {
    echo -e "${CYAN}Showing development database logs...${NC}"
    docker-compose -f docker-compose.dev.yml logs -f
}

docker_dev_restart() {
    echo -e "${CYAN}Restarting development database...${NC}"
    docker-compose -f docker-compose.dev.yml restart
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Development database restarted successfully!${NC}"
    else
        echo -e "${RED}Error restarting development database!${NC}"
        return 1
    fi
}

docker_dev_reset() {
    echo -e "${YELLOW}⚠️  WARNING: This will delete all database data!${NC}"
    read -p "Are you sure you want to reset the database? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo -e "${CYAN}Resetting development database...${NC}"
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose -f docker-compose.dev.yml up -d
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Development database reset successfully!${NC}"
        else
            echo -e "${RED}Error resetting development database!${NC}"
            return 1
        fi
    else
        echo -e "${BLUE}Database reset cancelled.${NC}"
    fi
}



db_generate_migration() {
    echo -e "${CYAN}Generating database migration...${NC}"
    
    npm run db:generate
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migration generated successfully!${NC}"
        echo -e "${BLUE}Check the drizzle/ directory for new migration files.${NC}"
    else
        echo -e "${RED}✗ Migration generation failed!${NC}"
        return 1
    fi
}

db_run_migration() {
    echo -e "${CYAN}Running database migrations...${NC}"
    
    # Ensure we're using the correct environment
    if [ "$ENV_TYPE" != "local" ]; then
        echo -e "${YELLOW}Switching to local environment for database operations...${NC}"
        load_environment "local"
    fi

    if [ -n "$DATABASE_URL" ]; then
        echo -e "${BLUE}Database URL: ${DATABASE_URL}${NC}"
    else
        echo -e "${BLUE}Database URL: not set${NC}"
    fi

    # Check if migrations directory exists
    if [ ! -d "migrations" ]; then
        echo -e "${RED}Error: migrations/ directory not found!${NC}"
        return 1
    fi
    
    npm run db:migrate
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migrations completed successfully!${NC}"
    else
        echo -e "${RED}✗ Migration failed!${NC}"
        return 1
    fi
}


# --- Environment Management Functions ---
switch_to_local() {
    echo -e "${CYAN}Switching to local development environment...${NC}"
    load_environment "local"
    echo -e "${GREEN}✓ Switched to local development environment${NC}"
    echo -e "${BLUE}Current environment: ${ENV_TYPE}${NC}"
}

switch_to_production() {
    echo -e "${CYAN}Switching to production environment...${NC}"
    load_environment "production"
    echo -e "${GREEN}✓ Switched to production environment${NC}"
    echo -e "${BLUE}Current environment: ${ENV_TYPE}${NC}"
}

show_current_env() {
    echo -e "${CYAN}Current Environment Information:${NC}"
    echo -e "${BLUE}Environment Type: ${ENV_TYPE}${NC}"
    echo -e "${BLUE}Database User: ${POSTGRES_USER:-not set}${NC}"
    echo -e "${BLUE}Database Name: ${POSTGRES_DB:-not set}${NC}"
    echo -e "${BLUE}Node Environment: ${NODE_ENV:-not set}${NC}"
    if [ -n "$DATABASE_URL" ]; then
        echo -e "${BLUE}Database URL: ${DATABASE_URL:0:20}...${NC}"
    else
        echo -e "${BLUE}Database URL: not set${NC}"
    fi
}

# --- Setup Functions ---
setup_env() {
    echo -e "${CYAN}Environment Setup${NC}"
    echo -e "${BLUE}Choose which environment file to create:${NC}"
    echo "1) Local Development (.env.local)"
    echo "2) Production (.env.prod)"
    echo "3) Both"
    echo "4) Cancel"
    
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            if [ -f ".env.local" ]; then
                echo -e "${YELLOW}.env.local already exists. Skipping creation.${NC}"
            else
                echo -e "${CYAN}Creating .env.local file from .env.local.example...${NC}"
                if [ -f ".env.local.example" ]; then
                    cp .env.local.example .env.local
                    echo -e "${GREEN}✓ .env.local file created successfully. Please update with your local secrets.${NC}"
                else
                    echo -e "${RED}Error: .env.local.example not found!${NC}"
                    return 1
                fi
            fi
            ;;
        2)
            if [ -f ".env.prod" ]; then
                echo -e "${YELLOW}.env.prod already exists. Skipping creation.${NC}"
            else
                echo -e "${CYAN}Creating .env.prod file from .env.prod.example...${NC}"
                if [ -f ".env.prod.example" ]; then
                    cp .env.prod.example .env.prod
                    echo -e "${GREEN}✓ .env.prod file created successfully. Please update with your production secrets.${NC}"
                else
                    echo -e "${RED}Error: .env.prod.example not found!${NC}"
                    return 1
                fi
            fi
            ;;
        3)
            setup_env_local
            setup_env_prod
            ;;
        4)
            echo -e "${BLUE}Environment setup cancelled.${NC}"
            ;;
        *)
            echo -e "${RED}Invalid choice. Please try again.${NC}"
            setup_env
            ;;
    esac
}

setup_env_local() {
    if [ -f ".env.local" ]; then
        echo -e "${YELLOW}.env.local already exists. Skipping creation.${NC}"
    else
        echo -e "${CYAN}Creating .env.local file from .env.local.example...${NC}"
        if [ -f ".env.local.example" ]; then
            cp .env.local.example .env.local
            echo -e "${GREEN}✓ .env.local file created successfully. Please update with your local secrets.${NC}"
        else
            echo -e "${RED}Error: .env.local.example not found!${NC}"
            return 1
        fi
    fi
}

setup_env_prod() {
    if [ -f ".env.prod" ]; then
        echo -e "${YELLOW}.env.prod already exists. Skipping creation.${NC}"
    else
        echo -e "${CYAN}Creating .env.prod file from .env.prod.example...${NC}"
        if [ -f ".env.prod.example" ]; then
            cp .env.prod.example .env.prod
            echo -e "${GREEN}✓ .env.prod file created successfully. Please update with your production secrets.${NC}"
        else
            echo -e "${RED}Error: .env.prod.example not found!${NC}"
            return 1
        fi
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
            "Deploy"
            "Generate SSH Key (local)"
            "Copy SSH Key to Server"
            "Test SSH Connection"
            "Check Docker Logs"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Deployment action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) deploy; break ;;
                2) deploy_generate_key; break ;;
                3) deploy_copy_key; break ;;
                4) deploy_test_conn; break ;;
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
            "Create Environment Files"
            "Switch to Local Environment"
            "Switch to Production Environment"
            "Show Current Environment"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Setup action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) setup_env; break ;;
                2) switch_to_local; break ;;
                3) switch_to_production; break ;;
                4) show_current_env; break ;;
                $((${#options[@]}))) return ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Please try again.${NC}"
                    break
                    ;;
            esac
        done
    done
}

show_docker_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Docker Compose Management ---${NC}"
        echo -e "${BLUE}Current Environment: ${ENV_TYPE}${NC}"
        local options=(
            "Start Development Database"
            "Stop Development Database"
            "Restart Development Database"
            "Check Database Status"
            "View Database Logs"
            "Reset Database (⚠️  DANGER)"
            "Switch to Local Environment"
            "Switch to Production Environment"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Docker action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) docker_dev_up; break ;;
                2) docker_dev_down; break ;;
                3) docker_dev_restart; break ;;
                4) docker_dev_status; break ;;
                5) docker_dev_logs; break ;;
                6) docker_dev_reset; break ;;
                7) switch_to_local; break ;;
                8) switch_to_production; break ;;
                $((${#options[@]}))) return ;;
                *)
                    echo -e "${RED}Invalid option '$REPLY'. Please try again.${NC}"
                    break
                    ;;
            esac
        done
    done
}

show_database_menu() {
    while true; do
        echo -e "\n${BOLD}${CYAN}--- Database Management ---${NC}"
        echo -e "${BLUE}Current Environment: ${ENV_TYPE}${NC}"
        local options=(
            "Generate Migration"
            "Run Migrations"
            "Back to Main Menu"
        )
        COLUMNS=1
        PS3="Database action (0 to clear)? "
        select opt in "${options[@]}"; do
            case $REPLY in
                0) clear; break ;;
                1) db_generate_migration; break ;;
                2) db_run_migration; break ;;
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
            "Docker"
            "Database"
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
                4) show_docker_menu; break ;;
                5) show_database_menu; break ;;
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