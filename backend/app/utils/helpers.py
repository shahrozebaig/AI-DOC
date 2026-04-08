import os
import uuid


def generate_file_id():
    """Generate unique file ID"""
    return str(uuid.uuid4())


def get_file_extension(filename: str):
    """Get file extension"""
    return os.path.splitext(filename)[1].lower()


def is_supported_file(filename: str):
    """Check if file type is supported"""
    allowed_extensions = [".pdf", ".txt", ".docx"]
    ext = get_file_extension(filename)
    return ext in allowed_extensions


def ensure_directory(path: str):
    """Create directory if it doesn't exist"""
    if not os.path.exists(path):
        os.makedirs(path)


def clean_text(text: str):
    """Basic text cleaning"""
    return text.strip().replace("\n", " ")