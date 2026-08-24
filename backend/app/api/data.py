from fastapi import APIRouter, HTTPException, Depends
from app.db.supabase_client import supabase
from pydantic import BaseModel
import os

router = APIRouter()

class ClearDataRequest(BaseModel):
    user_id: str

@router.delete("/clear-all/")
async def clear_all_data(req: ClearDataRequest):
    try:
        user_id = req.user_id
        sessions_res = supabase.table("chat_sessions").select("id").eq("user_id", user_id).execute()
        session_ids = [s["id"] for s in sessions_res.data]
        
        if session_ids:
            supabase.table("chat_messages").delete().in_("session_id", session_ids).execute()
            supabase.table("chat_sessions").delete().eq("user_id", user_id).execute()
        
        import psycopg2
        db_url = os.getenv("SUPABASE_DB_URL")
        
        if db_url:
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                cur.execute("DELETE FROM vecs.documents WHERE (metadata->>'user_id')::uuid = %s", (user_id,))
            conn.close()
        
        user_upload_dir = os.path.join("app/data/uploads", user_id)
        
        if os.path.exists(user_upload_dir):
            import shutil
            shutil.rmtree(user_upload_dir)
        
        return {"message": "All data cleared successfully", "error": False}
    except Exception as e:
        print(f"Error clearing data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear-chats/")
async def clear_chats(req: ClearDataRequest):
    try:
        user_id = req.user_id
        sessions_res = supabase.table("chat_sessions").select("id").eq("user_id", user_id).execute()
        session_ids = [s["id"] for s in sessions_res.data]
        
        if session_ids:
            supabase.table("chat_messages").delete().in_("session_id", session_ids).execute()
            supabase.table("chat_sessions").delete().eq("user_id", user_id).execute()
            
        return {"message": "Chat history cleared successfully", "error": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
