def main():
    print("Downloading HuggingFace model during build...")
    from llama_index.embeddings.huggingface import HuggingFaceEmbedding
    model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
    print("Model downloaded successfully!")

if __name__ == "__main__":
    main()