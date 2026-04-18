import os
from llama_index.core import SimpleDirectoryReader
from app.core.rag_engine import create_index

def load_and_index(upload_dir: str):
    try:
        # Load all documents from the upload directory
        documents = SimpleDirectoryReader(
            input_dir=upload_dir
        ).load_data()
        
        if not documents:
            raise ValueError("No content found in documents")
            
        create_index(documents)
        return True
    except Exception as e:
        print(f"Error indexing documents: {e}")
        return False