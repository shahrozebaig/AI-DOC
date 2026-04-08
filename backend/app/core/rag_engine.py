from llama_index.core import VectorStoreIndex, Settings
from llama_index.core.storage.storage_context import StorageContext
from llama_index.vector_stores.faiss import FaissVectorStore
import faiss
import os
from app.core.llm import llm
from app.core.embeddings import embed_model
Settings.llm = llm
Settings.embed_model = embed_model
VECTOR_PATH = "app/vector_store"
dimension = 384
faiss_index = faiss.IndexFlatL2(dimension)
vector_store = FaissVectorStore(faiss_index=faiss_index)
storage_context = StorageContext.from_defaults(vector_store=vector_store)
index = None
query_engine = None
def create_index(documents):
    global index, query_engine
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context
    )
    query_engine = index.as_query_engine()
def get_query_engine():
    global query_engine
    if query_engine is None:
        raise Exception("No documents indexed yet. Please upload documents first.")
    return query_engine