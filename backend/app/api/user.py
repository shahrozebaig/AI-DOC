from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


class DeleteUserRequest(BaseModel):
    user_id: str


@router.delete("/delete-account")
def delete_account(req: DeleteUserRequest):
    url = f"{SUPABASE_URL}/auth/v1/admin/users/{req.user_id}"

    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    }

    response = requests.delete(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to delete user")

    return {"message": "Account deleted successfully"}