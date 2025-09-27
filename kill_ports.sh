#!/bin/bash

# Kill Ports Script
# Usage: ./kill_ports.sh [port1] [port2] [port3] ...
# Example: ./kill_ports.sh 3000 5173 8080

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to kill a single port
kill_port() {
    local port=$1
    echo -e "${YELLOW}Checking port $port...${NC}"
    
    # Find PIDs using the port
    pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        echo -e "${YELLOW}No process found on port $port${NC}"
        return
    fi
    
    # Show what processes will be killed
    echo -e "${YELLOW}Processes on port $port:${NC}"
    lsof -i:$port 2>/dev/null
    
    # Kill the processes
    echo "$pids" | xargs kill -9 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully killed processes on port $port${NC}"
    else
        echo -e "${RED}✗ Failed to kill processes on port $port${NC}"
    fi
    echo ""
}

# Function to kill common development ports
kill_common_ports() {
    local common_ports=(3000 3001 5173 4173 8000 8080 8081 9000)
    echo -e "${YELLOW}Killing common development ports: ${common_ports[*]}${NC}"
    echo ""
    
    for port in "${common_ports[@]}"; do
        kill_port $port
    done
}

# Main script logic
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}No ports specified. Do you want to kill common development ports? (y/N)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        kill_common_ports
    else
        echo "Usage: $0 [port1] [port2] [port3] ..."
        echo "Example: $0 3000 5173 8080"
        echo ""
        echo "Or run without arguments to kill common development ports:"
        echo "3000, 3001, 5173, 4173, 8000, 8080, 8081, 9000"
        exit 1
    fi
else
    echo -e "${YELLOW}Killing specified ports: $@${NC}"
    echo ""
    
    for port in "$@"; do
        # Validate port number
        if ! [[ "$port" =~ ^[0-9]+$ ]] || [ "$port" -lt 1 ] || [ "$port" -gt 65535 ]; then
            echo -e "${RED}Invalid port number: $port${NC}"
            continue
        fi
        
        kill_port $port
    done
fi

echo -e "${GREEN}Done!${NC}"
