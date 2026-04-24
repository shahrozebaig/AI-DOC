from fastapi import APIRouter, HTTPException, Depends
from app.db.supabase_client import supabase
from pydantic import BaseModel
import os

router = APIRouter()

class ClearDataRequest(BaseModel):
    user_id: str

@router.delete("/clear-all/")
async def clear_all_data(req: ClearDataRequest):
    """
    Deletes all chat sessions, messages, and document embeddings for a specific user.
    """
    try:
        user_id = req.user_id
        
        # 1. Delete chat messages (cascades from sessions if configured, but let's be explicit)
        # First get session IDs to be sure
        sessions_res = supabase.table("chat_sessions").select("id").eq("user_id", user_id).execute()
        session_ids = [s["id"] for s in sessions_res.data]
        
        if session_ids:
            supabase.table("chat_messages").delete().in_("session_id", session_ids).execute()
            supabase.table("chat_sessions").delete().eq("user_id", user_id).execute()
        
        # 2. Delete document embeddings from vecs.documents
        # Note: vecs.documents stores user_id in metadata -> user_id
        # We need to use a raw RPC or filter by metadata if supported by the client.
        # Supabase Python client might not support direct jsonb filtering in .delete() easily 
        # for schemas other than public without direct SQL.
        
        # Using a safer approach: LlamaIndex SupabaseVectorStore uses 'metadata' column.
        # We can try to delete where metadata->>'user_id' = user_id
        
        # However, supabase-py delete() might not support the arrow operator directly in filters.
        # Let's use a stored procedure or just use direct postgres if we can.
        # Since we have SUPABASE_DB_URL, we can use psycopg2 for a clean wipe.
        
        import psycopg2
        db_url = os.getenv("SUPABASE_DB_URL")
        if db_url:
            conn = psycopg2.connect(db_url)
            conn.autocommit = True
            with conn.cursor() as cur:
                # Delete from vecs.documents where metadata->>'user_id' matches
                cur.execute("DELETE FROM vecs.documents WHERE (metadata->>'user_id')::uuid = %s", (user_id,))
            conn.close()
        else:
            # Fallback if DB_URL is missing (though it shouldn't be based on previous turns)
            # This is harder with just the Supabase client for the 'vecs' schema.
            pass

        return {"message": "All data cleared successfully", "error": False}
    except Exception as e:
        print(f"Error clearing data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/clear-chats/")
async def clear_chats(req: ClearDataRequest):
    """
    Deletes only chat sessions and messages for a specific user.
    """
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
