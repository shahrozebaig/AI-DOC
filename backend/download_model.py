from fastembed import TextEmbedding
def main():
    print("Downloading FastEmbed model during build...")
    model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    print("Model downloaded and cached successfully!")
if __name__ == "__main__":
    main()