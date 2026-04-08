from fastapi import APIRouter, UploadFile, File
import os
from app.services.document_loader import load_and_index
router = APIRouter()
UPLOAD_DIR = "app/data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    load_and_index(file_path)
    return {"message": "File uploaded and indexed"}