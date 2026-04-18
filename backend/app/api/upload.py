from fastapi import APIRouter, UploadFile, File
import os
from typing import List
from app.services.document_loader import load_and_index

router = APIRouter()
UPLOAD_DIR = "app/data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_files(files: List[UploadFile] = File(...)):
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
    
    # Re-index EVERYTHING in the directory
    load_and_index(UPLOAD_DIR)
    
    return {"message": f"{len(files)} files uploaded and indexed"}