from llama_index.core import SimpleDirectoryReader
from app.core.rag_engine import create_index


def load_and_index(file_path: str):
    try:
        documents = SimpleDirectoryReader(
            input_files=[file_path]
        ).load_data()

        if not documents:
            raise ValueError("No content found in document")

        create_index(documents)

        return True

    except Exception as e:
        print(f"Error indexing document: {e}")
        return False