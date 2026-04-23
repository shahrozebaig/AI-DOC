def main():
    print("Downloading FastEmbed model during build...")
    from fastembed import TextEmbedding
    model = TextEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2", cache_dir="./model_cache")
    print("Model downloaded successfully!")

if __name__ == "__main__":
    main()