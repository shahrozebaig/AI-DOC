from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.vector_stores.faiss import FaissVectorStore
from llama_index.core.memory import ChatMemoryBuffer
import faiss
index = None
query_engine = None
def init_models():
    from app.core.llm import get_llm
    from app.core.embeddings import get_embed_model
    Settings.llm = get_llm()
    Settings.embed_model = get_embed_model()
    Settings.chunk_size = 512
    Settings.chunk_overlap = 50
    Settings.embed_batch_size = 2
def create_index(documents):
    global index, query_engine
    init_models()
    dimension = 384
    faiss_index = faiss.IndexFlatL2(dimension)
    vector_store = FaissVectorStore(faiss_index=faiss_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    # Use standard insertion but highly constrained via Settings
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        show_progress=False
    )

    import gc
    gc.collect()

    query_engine = index.as_query_engine(
        similarity_top_k=5, 
        response_mode="compact" 
    )
def get_query_engine():
    global query_engine
    if query_engine is None:
        raise Exception("No documents indexed yet. Upload a file first.")
    return query_engine
def get_chat_engine(history=None):
    global index
    if index is None:
        raise Exception("No documents indexed yet. Upload a file first.")
    memory = ChatMemoryBuffer.from_defaults(token_limit=1500)
    return index.as_chat_engine(
        chat_mode="context",
        memory=memory,
        system_prompt=(
            "You are a professional AI assistant with access to multiple documents. "
            "When answering, synthesize information from ALL relevant documents in the context. "
            "IMPORTANT: Do NOT mention full local file paths (e.g., C:\\Users\\... or app/data/uploads/...) in your response. "
            "Simply refer to documents by their names if necessary, or just provide the answer directly."
        ),
        similarity_top_k=20, 
        verbose=True
    )