from fastapi import APIRouter, UploadFile, File, Form
import os
from typing import List
from fastapi.concurrency import run_in_threadpool
from app.services.document_loader import load_and_index
router = APIRouter()
UPLOAD_DIR = "app/data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
@router.post("/")
async def upload_files(user_id: str = Form(...), files: List[UploadFile] = File(...)):
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    for file in files:
        file_path = os.path.join(user_dir, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
            
    success = await run_in_threadpool(load_and_index, user_dir, user_id)
    if not success:
        return {"message": f"{len(files)} files uploaded but indexing FAILED. Please check server logs.", "error": True}
    return {"message": f"{len(files)} files uploaded and indexed successfully", "error": False}