def get_embed_model():
    from llama_index.embeddings.fastembed import FastEmbedEmbedding
    return FastEmbedEmbedding(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        cache_dir="./model_cache",
        threads=1
    )