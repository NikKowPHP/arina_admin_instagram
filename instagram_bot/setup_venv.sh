#!/bin/bash

# Virtual environment setup script for Instagram Bot

echo "Setting up Python virtual environment..."

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not found. Please install Python 3 and try again."
    exit 1
fi

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
if [ "$OSTYPE" == "darwin*" ]; then
    # macOS
    source venv/bin/activate
elif [ "$OSTYPE" == "linux-gnu" ]; then
    # Linux
    source venv/bin/activate
elif [ "$OSTYPE" == "win32" ]; then
    # Windows (not fully supported)
    .\\venv\\Scripts\\activate
else
    echo "Unsupported operating system: $OSTYPE"
    exit 1
fi

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

echo "Virtual environment setup complete."
echo "Activate with: source venv/bin/activate (macOS/Linux) or .\\venv\\Scripts\\activate (Windows)"