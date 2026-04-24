from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.vector_stores.supabase import SupabaseVectorStore
from llama_index.core.memory import ChatMemoryBuffer
import os

user_indices = {}
user_query_engines = {}

def init_models():
    from app.core.llm import get_llm
    from app.core.embeddings import get_embed_model
    Settings.llm = get_llm()
    Settings.embed_model = get_embed_model()
    Settings.chunk_size = 512
    Settings.chunk_overlap = 50
    Settings.embed_batch_size = 2

def get_vector_store(user_id: str):
    return SupabaseVectorStore(
        postgres_connection_string=os.getenv("SUPABASE_DB_URL"),
        collection_name="documents",
    )

def create_index(documents, user_id: str):
    global user_indices, user_query_engines
    init_models()
    
    # Add user_id to metadata for RLS
    for doc in documents:
        doc.metadata["user_id"] = user_id

    vector_store = get_vector_store(user_id)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        show_progress=False
    )

    import gc
    gc.collect()

    user_indices[user_id] = index
    user_query_engines[user_id] = index.as_query_engine(
        similarity_top_k=5, 
        response_mode="compact" 
    )

def get_query_engine(user_id: str):
    if user_id not in user_query_engines:
        # Try to restore from Supabase
        init_models()
        vector_store = get_vector_store(user_id)
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
        user_indices[user_id] = index
        user_query_engines[user_id] = index.as_query_engine(similarity_top_k=5, response_mode="compact")
    
    return user_query_engines[user_id]

def get_chat_engine(user_id: str, history=None):
    if user_id not in user_indices:
        # Try to restore from Supabase
        try:
            init_models()
            vector_store = get_vector_store(user_id)
            index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
            user_indices[user_id] = index
        except Exception:
            raise Exception("No documents indexed yet. Upload a file first.")
            
    index = user_indices[user_id]
    memory = ChatMemoryBuffer.from_defaults(token_limit=1500)
    return index.as_chat_engine(
        chat_mode="context",
        memory=memory,
        system_prompt=(
            "You are a professional AI assistant with access to multiple documents. "
            "When answering, synthesize information from ALL relevant documents in the context. "
            "STRICT FORMATTING RULES:\n"
            "1. ALWAYS structure your response using numbered points (1., 2., 3., etc.). Every paragraph or section must start with a number.\n"
            "2. If asked for a table, provide a clean Markdown table. CRITICAL: Do NOT use bolding (**) inside the table headers or cells.\n"
            "3. DO NOT use double asterisks (**) for bolding text anywhere in the response. Use plain text only.\n"
            "4. Provide long, detailed answers if necessary, but keep them organized in the numbered points format.\n"
            "5. NEVER mention full local file paths (e.g., C:\\Users\\... or app/data/uploads/...). Refer to documents by their names only."
        ),
        similarity_top_k=20, 
        verbose=True
    )