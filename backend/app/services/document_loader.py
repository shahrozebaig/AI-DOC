import os
from llama_index.core import SimpleDirectoryReader
from app.core.rag_engine import create_index
def load_and_index(upload_dir: str, user_id: str):
    try:
        documents = SimpleDirectoryReader(
            input_dir=upload_dir
        ).load_data()
        if not documents:
            raise ValueError("No content found in documents")
        print(f"DEBUG: Loading {len(documents)} document chunks from {len(set([d.metadata.get('file_name') for d in documents]))} unique files for user {user_id}.")
        for doc in documents:
            if 'file_name' in doc.metadata:
                print(f"DEBUG: Indexed chunk from {doc.metadata['file_name']}")
        create_index(documents, user_id)
        return True
    except Exception as e:
        print(f"Error indexing documents: {e}")
        return False