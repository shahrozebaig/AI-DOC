def get_embed_model():
    from llama_index.embeddings.fastembed import FastEmbedEmbedding
    return FastEmbedEmbedding(
        model_name="BAAI/bge-small-en-v1.5",
        cache_dir="./model_cache",
        threads=1
    )