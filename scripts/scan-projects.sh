#!/bin/bash

source "scripts/repomix-runner.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOCS_CACHE_DIR="./ai-docs"
LOG_DIR="./ai-docs/logs/docs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Ensure required directories exist
mkdir -p "$DOCS_CACHE_DIR"
mkdir -p "$LOG_DIR"
mkdir -p "repomix-configs"

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "Loaded environment variables from .env"
fi

# Log both to file and console
log() {
    echo -e "${2:-$BLUE}$1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_DIR/docs-manager_$TIMESTAMP.log"
}

# Error handling
handle_error() {
    log "Error: $1" "$RED"
    exit 1
}

# Check if process is running
check_lock() {
    local max_attempts=30  # Maximum number of attempts
    local attempt=1
    local wait_time=2      # Seconds to wait between attempts

    while [ $attempt -le $max_attempts ]; do
        if [ -f "$LOG_DIR/docs.lock" ]; then
            PID=$(cat "$LOG_DIR/docs.lock")
            if kill -0 $PID 2>/dev/null; then
                log "Another docs process is running (PID: $PID), waiting... (attempt $attempt/$max_attempts)" "$YELLOW"
                sleep $wait_time
                attempt=$((attempt + 1))
            else
                rm "$LOG_DIR/docs.lock"
                break
            fi
        else
            break
        fi
    done

    if [ $attempt -gt $max_attempts ]; then
        handle_error "Timeout waiting for lock to be released"
    fi

    echo $$ > "$LOG_DIR/docs.lock"
}

# Clean up lock file on exit
cleanup() {
    if [ -f "$LOG_DIR/docs.lock" ]; then
        rm -f "$LOG_DIR/docs.lock"
        log "Lock file cleaned up" "$BLUE"
    fi
}
trap cleanup EXIT
trap cleanup INT    # Handle Ctrl+C
trap cleanup TERM   # Handle termination

# Scan app for components and generate config
scan_app() {
    local app_name="$1"
    
    if [ -z "$app_name" ]; then
        handle_error "Usage: $0 scan <app-name>"
    fi

    log "Scanning app: $app_name..."
    check_lock
    
    GITHUB_TOKEN="$GITHUB_TOKEN" npx tsx tools/project-scanner.ts "$app_name"
    local scan_result=$?
    
    if [ $scan_result -ne 0 ]; then
        cleanup
        handle_error "Failed to scan app: $app_name"
    fi
    
    log "App scan completed successfully" "$GREEN"
    
    # Run repomix after successful scan
    run_repomix "$app_name"
    
    cleanup
    sleep 1
}

scan_all_apps() {
    local apps=("admin-dashboard" "auth-service" "main-app" "website" "monitoring-dashboard")
    local total=${#apps[@]}
    local current=1

    log "Starting scan of all apps..." "$BLUE"
    
    for app in "${apps[@]}"; do
        log "[$current/$total] Scanning $app..." "$BLUE"
        scan_app "$app"
        current=$((current + 1))
        
        if [ $current -le $total ]; then
            log "Waiting before next scan..." "$BLUE"
            sleep 2
        fi
    done

    log "All apps scanned successfully!" "$GREEN"
}

# Update the main command handler to include direct repomix commands
case "$1" in
    scan)
        scan_app "$2"
        ;;
    scan-all)
        scan_all_apps
        ;;
    repomix)
        run_repomix "$2"
        ;;
    repomix-all)
        run_all_repomix
        ;;
    *)
        echo "Usage: $0 {scan|scan-all|repomix|repomix-all}"
        echo
        echo "Commands:"
        echo "  scan <app-name>     - Scan specific app and generate config"
        echo "  scan-all            - Scan all apps and generate configs"
        echo "  repomix <app-name>  - Run repomix for specific app configs"
        echo "  repomix-all         - Run repomix for all app configs"
        exit 1
        ;;
esac

exit 0