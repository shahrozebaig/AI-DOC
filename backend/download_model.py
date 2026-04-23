from fastembed import TextEmbedding
def main():
    print("Downloading FastEmbed model during build...")
    model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5", cache_dir="./model_cache")
    print("Model downloaded and cached successfully!")
if __name__ == "__main__":
    main()