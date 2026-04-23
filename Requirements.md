# AI Models Architecture & History

This document tracks the complete evolution of Machine Learning models used in the AI-DOC platform, documented in a structured format for clarity and quick reference.

---

## 1. Complete Model History

| Model Name                 | Purpose                  | Status    | Engine / Optimization Reason                                |
| -------------------------- | ------------------------ | --------- | ----------------------------------------------------------- |
| Face Recognition (ResNet)  | Biometric Facial Login   | ❌ Removed | Required dlib & OpenCV. Build size too large for 512MB RAM. |
| Sentence-Transformers (L6) | Document Embeddings      | ❌ Removed | Used PyTorch (torch). Idle RAM usage was over 400MB+.       |
| BGE Small (v1.5)           | High-Accuracy Embeddings | ❌ Removed | ~133MB size. Caused 100s timeouts on large PDF uploads.     |
| all-MiniLM-L6-v2           | Optimized Embeddings     | ✅ CURRENT | FastEmbed (ONNX). Tiniest model (~90MB). RAM-safe.          |
| Llama3-8b-8192             | AI Chat Synthesis        | ✅ CURRENT | Groq Cloud API. Zero local RAM usage. High-speed inference. |

### Observations

* Model selection evolved primarily based on memory constraints and deployment feasibility.
* Transition from heavy frameworks to lightweight alternatives improved stability.
* Current setup balances performance, speed, and cost efficiency.

---

## 2. Key Logic for Optimization

| Decision              | Logic & Impact                                                                 |
| --------------------- | ------------------------------------------------------------------------------ |
| PyTorch → ONNX        | Swapping PyTorch for ONNX Runtime reduced idle RAM usage by over 60%.          |
| Multi-thread → Single | Constricting AI to threads=1 prevented CPU shuttering and Render timeouts.     |
| Global → Isolated     | Moved to user_indices to ensure complete data privacy between different users. |
| Local → Cloud         | Using Groq API saved 4GB of RAM and enabled free-tier hosting deployment.      |

### Additional Optimization Insights

* Reducing dependency size directly improved deployment success rates.
* Cloud-based inference eliminated infrastructure limitations.
* Isolation of user data improved both privacy and scalability.

---

## 3. Embedding Models Comparison for Document Parsing

| Model     | Size   | Speed     | Accuracy  |
| --------- | ------ | --------- | --------- |
| MiniLM    | Small  | Very Fast | Moderate  |
| BGE-small | Small  | Fast      | High      |
| BGE-base  | Medium | Medium    | Very High |

### Key Takeaways

* MiniLM was selected for its balance of speed and low resource usage.
* BGE models provide better accuracy but require more resources.
* Trade-off decisions were made based on deployment constraints.

---

## 4. Removed Libraries

| Library Removed  | Why we removed it?          | Impact of Removal                          |
| ---------------- | --------------------------- | ------------------------------------------ |
| PyTorch (torch)  | Too heavy for free servers. | Saved 400MB+ of RAM immediately.           |
| dlib             | Required complex C++ build. | Fixed server crashing during build phase.  |
| face_recognition | Massive space & RAM hog.    | Freed up 1GB+ of disk space and 200MB RAM. |
| opencv-python    | Only used for face logic.   | Optimized the overall package size.        |

### Removal Strategy

* Eliminated non-essential heavy dependencies.
* Focused only on components required for core functionality.
* Improved build reliability and deployment speed.

---

## 5. Current Optimized Core Stack

| Library / Tech | Purpose             | Why we use it?                                                        |
| -------------- | ------------------- | --------------------------------------------------------------------- |
| FastEmbed      | Document Embeddings | Uses ONNX to run AI without needing heavy PyTorch or massive RAM.     |
| LlamaIndex     | RAG Engine          | Provides the best tools for connecting PDFs to AI brains.             |
| FAISS          | Vector Database     | Fast, in-memory search that doesn't require an expensive external DB. |
| Groq           | AI Chat (LLM)       | Lightning-fast cloud inference that uses zero local server memory.    |
| Supabase       | Database & Auth     | Reliable cloud storage for chats and secure user authentication.      |

### System Highlights

* Fully optimized for low-resource environments.
* Designed for scalability and modular upgrades.
* Combines local efficiency with cloud-based intelligence.

---