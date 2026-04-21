from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
load_dotenv() 
router = APIRouter()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
class DeleteUserRequest(BaseModel):
    user_id: str
@router.delete("/delete-account")
def delete_account(req: DeleteUserRequest):
    if not SUPABASE_URL or not SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="Missing Supabase config")
    url = f"{SUPABASE_URL}/auth/v1/admin/users/{req.user_id}"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    }
    response = requests.delete(url, headers=headers)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=response.text)
    return {"message": "Account deleted successfully"}