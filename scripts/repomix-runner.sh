#!/bin/bash

run_repomix() {
    local app_name="$1"
    local config_dir="repomix-configs/$app_name"
    
    if [ ! -d "$config_dir" ]; then
        log "No configs found for $app_name" "$YELLOW"
        return 1
    fi

    log "Running repomix for $app_name configs..." "$BLUE"
    
    # Find all json config files
    for config in "$config_dir"/*.json; do
        if [ -f "$config" ]; then
            local context_name=$(basename "$config" .json)
            log "Generating context: $context_name" "$BLUE"
            
            npx repomix --config "$config"
            if [ $? -ne 0 ]; then
                log "Failed to generate context: $context_name" "$RED"
                continue
            fi
            
            log "Successfully generated: $context_name" "$GREEN"
        fi
    done
    
    log "Completed repomix generation for $app_name" "$GREEN"
}

# Run for all apps
run_all_repomix() {
    log "Running repomix for all apps..." "$BLUE"
    
    for app_dir in repomix-configs/*/; do
        if [ -d "$app_dir" ]; then
            local app_name=$(basename "$app_dir")
            run_repomix "$app_name"
        fi
    done
    
    log "Completed all repomix generations" "$GREEN"
}


