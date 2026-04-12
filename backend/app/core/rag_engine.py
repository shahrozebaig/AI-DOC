from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss

index = None
query_engine = None


# 🔥 LAZY LOAD MODELS
def init_models():
    from app.core.llm import get_llm
    from app.core.embeddings import get_embed_model

    Settings.llm = get_llm()
    Settings.embed_model = get_embed_model()
    
    # 🔥 Add chunk sizes so we get consistent semantic chunks for large files
    Settings.chunk_size = 512
    Settings.chunk_overlap = 50


# 🔥 CREATE INDEX ONLY WHEN FILE UPLOADED
def create_index(documents):
    global index, query_engine

    init_models()

    dimension = 384
    faiss_index = faiss.IndexFlatL2(dimension)

    vector_store = FaissVectorStore(faiss_index=faiss_index)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)

    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context
    )

    # 🔥 Increase top_k to 10 (default is 2) so the LLM pulls much more context from large files
    query_engine = index.as_query_engine(
        similarity_top_k=10, 
        response_mode="compact" # Will compact multiple chunks into the LLM prompt 
    )


# 🔥 USED IN CHAT
def get_query_engine():
    global query_engine

    if query_engine is None:
        raise Exception("No documents indexed yet. Upload a file first.")

    return query_engine