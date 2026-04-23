set -e
echo "Starting build process..."
pip install --no-cache-dir -r requirements.txt
pip install --no-cache-dir --no-deps face-recognition
echo "Build process completed successfully!"