def get_llm():
    from llama_index.llms.groq import Groq
    from app.config import GROQ_API_KEY
    return Groq(
        model="openai/gpt-oss-120b",
        api_key=GROQ_API_KEY
    )
