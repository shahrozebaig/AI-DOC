from fastapi import APIRouter
from pydantic import BaseModel
from app.core.rag_engine import get_query_engine

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def chat(req: ChatRequest):
    try:
        engine = get_query_engine()
        response = engine.query(req.message)

        return {
            "response": str(response)
        }
    except Exception as e:
        return {
            "error": str(e)
        }