#!/bin/bash
set -e

echo "=== Setting up Python Virtual Environment ==="
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

source venv/bin/activate
echo "Upgrading pip..."
pip install --upgrade pip

echo "=== Installing dependencies ==="
# Attempt to install everything first
if pip install -r requirements.txt; then
    echo "All dependencies installed successfully!"
else
    echo "Some dependencies failed to install (likely due to Python 3.13 compilation issues for deepface or librosa)."
    echo "Falling back to installing core dependencies first..."
    
    CORE_DEPS=(
        "fastapi==0.115.8"
        "uvicorn==0.34.0"
        "pydantic==2.10.6"
        "pydantic-settings==2.7.1"
        "motor==3.6.0"
        "pymongo==4.10.1"
        "bcrypt==4.2.1"
        "passlib==1.7.4"
        "python-jose[cryptography]==3.3.0"
        "python-multipart==0.0.20"
        "openai==1.61.1"
        "python-dotenv==1.0.1"
        "reportlab==4.3.1"
        "opencv-python-headless==4.11.0.86"
        "numpy==2.2.2"
        "soundfile==0.13.1"
    )
    
    for dep in "${CORE_DEPS[@]}"; do
        echo "Installing $dep..."
        pip install "$dep" || echo "Warning: Failed to install $dep"
    done
    
    echo "=== Attempting to install ML dependencies individually ==="
    pip install gdown==5.2.0 || echo "gdown install failed"
    pip install tf-keras==2.18.0 || echo "tf-keras install failed"
    pip install librosa==0.10.2.post1 || echo "librosa install failed, using mock voice analysis fallback"
    pip install deepface==0.0.93 || echo "deepface install failed, using mock emotion analysis fallback"
fi

echo "=== Backend Setup Complete ==="
