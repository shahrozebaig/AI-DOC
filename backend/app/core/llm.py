from llama_index.llms.groq import Groq
from app.config import GROQ_API_KEY

llm = Groq(
    model="llama-3.1-8b-instant",
    api_key=GROQ_API_KEY
)