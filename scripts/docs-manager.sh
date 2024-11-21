#!/bin/bash

# Docs management script
# Usage: ./scripts/docs-manager.sh <command> [options]

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    log "Loaded environment variables from .env"
else
    log "No .env file found" "$YELLOW"
fi

# Configuration
DOCS_CACHE_DIR="./ai-docs"
CONTEXT_FILE="ai-context.md"
LOG_DIR="./ai-docs/logs/docs"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Ensure required directories exist
mkdir -p "$DOCS_CACHE_DIR"
mkdir -p "$LOG_DIR"

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

score_doc() {
    log "Scoring document..."
    check_lock
    
    local doc_path="$1"
    local score="$2"
    local reason="$3"
    
    if [ -z "$doc_path" ] || [ -z "$score" ]; then
        handle_error "Usage: $0 score <doc_path> <score> [reason]"
    fi
    
    npx tsx tools/docs-manager.ts score "$doc_path" "$score" "$reason"
    if [ $? -ne 0 ]; then
        handle_error "Failed to score document"
    fi
    
    log "Document scored successfully" "$GREEN"
}

fetch_repo_docs() {
    log "Starting documentation fetch for repository: $1..."
    check_lock
    
    if [ -n "$GH_PERSONAL_TOKEN" ]; then
        log "Using provided GitHub token"
    else
        log "No GitHub token found. Rate limiting may apply." "$YELLOW"
    fi

    npx tsx tools/docs-manager.ts fetch-repo "$1"
    if [ $? -ne 0 ]; then
        handle_error "Failed to fetch documentation for $1"
    fi
    
    log "Documentation fetch completed successfully for $1" "$GREEN"
}

# Check if process is running
check_lock() {
    if [ -f "$LOG_DIR/docs.lock" ]; then
        PID=$(cat "$LOG_DIR/docs.lock")
        if kill -0 $PID 2>/dev/null; then
            log "Another docs process is running (PID: $PID)" "$YELLOW"
            exit 1
        else
            rm "$LOG_DIR/docs.lock"
        fi
    fi
    echo $$ > "$LOG_DIR/docs.lock"
}

# Clean up lock file on exit
cleanup() {
    rm -f "$LOG_DIR/docs.lock"
}
trap cleanup EXIT

# Fetch documentation
fetch_docs() {
    log "Starting documentation fetch..."
    check_lock
    
    if [ -n "$GH_PERSONAL_TOKEN" ]; then
        log "Using provided GitHub token"
    else
        log "No GitHub token found. Rate limiting may apply." "$YELLOW"
    fi

    npx tsx tools/docs-manager.ts fetch
    if [ $? -ne 0 ]; then
        handle_error "Failed to fetch documentation"
    fi
    
    log "Documentation fetch completed successfully" "$GREEN"
}

# Generate AI context
generate_context() {
    log "Generating AI context..."
    check_lock
    
    npx tsx tools/docs-manager.ts generate
    if [ $? -ne 0 ]; then
        handle_error "Failed to generate AI context"
    fi
    
    log "AI context generated successfully" "$GREEN"
}

# Clean cached docs
clean_cache() {
    log "Cleaning docs cache..."
    check_lock
    
    rm -rf "$DOCS_CACHE_DIR"/*
    mkdir -p "$DOCS_CACHE_DIR"
    
    log "Cache cleaned successfully" "$GREEN"
}

# Validate generated context
validate_context() {
    log "Validating context file..."
    
    if [ ! -f "$DOCS_CACHE_DIR/$CONTEXT_FILE" ]; then
        handle_error "Context file not found"
    fi
    
    # Check file size
    size=$(wc -c < "$DOCS_CACHE_DIR/$CONTEXT_FILE")
    if [ $size -lt 1000 ]; then
        handle_error "Context file seems too small (${size} bytes)"
    fi
    
    log "Context validation passed" "$GREEN"
}

# Show stats about the docs
show_stats() {
    log "Documentation Statistics:"
    
    doc_count=$(find "$DOCS_CACHE_DIR" -name "*.md" | wc -l)
    context_size=$(wc -c < "$DOCS_CACHE_DIR/$CONTEXT_FILE" 2>/dev/null || echo "0")
    context_size_kb=$((context_size / 1024))
    
    echo -e "${BLUE}Total documents: ${NC}$doc_count"
    echo -e "${BLUE}Context size: ${NC}${context_size_kb}KB"
    
    if [ -f "$DOCS_CACHE_DIR/doc-versions.yml" ]; then
        version_count=$(grep "path:" "$DOCS_CACHE_DIR/doc-versions.yml" | wc -l)
        echo -e "${BLUE}Versioned documents: ${NC}$version_count"
    fi

    echo -e "\n${BLUE}Document Scores:${NC}"
    for file in $(find "$DOCS_CACHE_DIR" -name "*.md"); do
        rel_path=$(realpath --relative-to="$DOCS_CACHE_DIR" "$file")
        score=$(grep "^$rel_path:" "$DOCS_CACHE_DIR/doc-scores.yml" | awk '{print $2}')
        echo -e "${BLUE}$rel_path:${NC} ${score:-'Not scored'}"
    done
}

# Main command handler
case "$1" in
    fetch)
        fetch_docs
        ;;
    fetch-repo)
    fetch_repo_docs "$2"
    ;;
    generate)
        generate_context
        ;;
    clean)
        clean_cache
        ;;
    validate)
        validate_context
        ;;
    stats)
        show_stats
        ;;
    score)
    score_doc "$2" "$3" "$4"
    ;;
    update)
        fetch_docs
        generate_context
        validate_context
        show_stats
        ;;
    *)
        echo "Usage: $0 {fetch|generate|clean|validate|stats|update}"
        echo
        echo "Commands:"
        echo "  fetch       - Fetch latest documentation"
        echo "  generate    - Generate AI context file"
        echo "  clean       - Clean documentation cache"
        echo "  validate    - Validate generated context"
        echo "  stats       - Show documentation statistics"
        echo "  update      - Perform full update cycle"
        exit 1
        ;;
esac

exit 0