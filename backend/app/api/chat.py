from fastapi import APIRouter, HTTPException
from app.models.chat_model import ChatRequest
from app.core.rag_engine import get_chat_engine
from app.db.supabase_client import supabase
from typing import List
import uuid
router = APIRouter()
@router.get("/sessions/{user_id}")
def get_sessions(user_id: str):
    try:
        response = supabase.table("chat_sessions").select("*").eq("user_id", user_id).order("updated_at", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/messages/{session_id}")
def get_messages(session_id: str):
    try:
        response = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("created_at").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.delete("/session/{session_id}")
def delete_session(session_id: str):
    try:
        supabase.table("chat_messages").delete().eq("session_id", session_id).execute()
        supabase.table("chat_sessions").delete().eq("id", session_id).execute()
        return {"message": "Session deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@router.post("/")
def chat(req: ChatRequest):
    try:
        session_id = req.session_id
        print(f"DEBUG: Processing chat for user {req.user_id}, session {session_id}")
        if not session_id:
            print("DEBUG: Creating new session...")
            session_title = req.message[:50] + "..." if len(req.message) > 50 else req.message
            session_response = supabase.table("chat_sessions").insert({
                "user_id": req.user_id,
                "title": session_title
            }).execute()
            if not session_response.data:
                print(f"DEBUG: Session creation failed! Response: {session_response}")
                raise Exception("Failed to create chat session in database.")
            session_id = session_response.data[0]["id"]
            print(f"DEBUG: Created session {session_id}")
        print("DEBUG: Getting chat engine...")
        engine = get_chat_engine(req.user_id)
        print("DEBUG: Saving user message...")
        supabase.table("chat_messages").insert({
            "session_id": session_id,
            "role": "user",
            "content": req.message
        }).execute()
        print("DEBUG: Querying AI...")
        response = engine.chat(req.message)
        ai_response = str(response)
        print("DEBUG: Saving AI response...")
        supabase.table("chat_messages").insert({
            "session_id": session_id,
            "role": "assistant",
            "content": ai_response
        }).execute()
        print("DEBUG: Updating session timestamp...")
        supabase.table("chat_sessions").update({
            "updated_at": "now()"
        }).eq("id", session_id).execute()
        print("DEBUG: Chat request successful")
        return {
            "response": ai_response,
            "session_id": session_id
        }
    except Exception as e:
        import traceback
        print("CHAT ERROR TRACEBACK:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))