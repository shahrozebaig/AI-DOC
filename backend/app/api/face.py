from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import numpy as np
import base64
import os
import cv2
import face_recognition 
from app.db.supabase_client import supabase
router = APIRouter()
class FaceRegisterRequest(BaseModel):
    user_id: str
    email: str
    image: str
class FaceLoginRequest(BaseModel):
    email: str
    image: str 
def decode_image(base64_string):
    try:
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image data")
@router.post("/register")
async def register_face(req: FaceRegisterRequest):
    img = decode_image(req.image)
    if img is None:
        raise HTTPException(status_code=400, detail="Could not decode image")
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    try:
        encodings = face_recognition.face_encodings(rgb_img)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Face analysis error: {str(e)}")
    if len(encodings) == 0:
        raise HTTPException(status_code=400, detail="No face detected in the image. Please try again with better lighting.")
    encoding = encodings[0].tolist() 
    try:
        data, error = supabase.table("face_auth").upsert({
            "user_id": req.user_id,
            "email": req.email,
            "face_encoding": encoding
        }).execute()
        return {"message": "Face registered successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
@router.post("/login")
async def login_face(req: FaceLoginRequest):
    try:
        response = supabase.table("face_auth").select("face_encoding", "user_id").eq("email", req.email).execute()
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Face ID has not been set up for this account yet.")
        stored_encoding = np.array(response.data[0]["face_encoding"])
        img = decode_image(req.image)
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        current_encodings = face_recognition.face_encodings(rgb_img)
        if len(current_encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected. Please ensure your face is visible.")
        current_encoding = current_encodings[0]
        matches = face_recognition.compare_faces([stored_encoding], current_encoding, tolerance=0.5)
        if matches[0]:
            link_response = supabase.auth.admin.generate_link({
                "type": "magiclink",
                "email": req.email,
                "options": {
                    "redirectTo": "http://localhost:3000/dashboard"
                }
            })
            return {
                "message": "Face verified successfully",
                "action_link": link_response.properties.action_link if hasattr(link_response, 'properties') else None,
                "verified": True
            }
        else:
            raise HTTPException(status_code=401, detail="Face verification failed. Identity could not be confirmed.")
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")