def main():
    print("Downloading FastEmbed model during build...")
    from fastembed import TextEmbedding
    model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", cache_dir="./model_cache")
    print("Model downloaded successfully!")

if __name__ == "__main__":
    main()