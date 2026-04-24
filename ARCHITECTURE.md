# Project Architecture Overview

## 1. System Stack

| Layer          | Technology Used                                 | Role / Purpose                                      |
| -------------- | ----------------------------------------------- | --------------------------------------------------- |
| **Frontend**   | React.js + Tailwind CSS                         | Responsive UI, Chat Interface, 3D Landing Page      |
| **Backend**    | FastAPI (Python)                                | Asynchronous REST API, RAG orchestration            |
| **AI Model**   | Groq Llama 3.1 8B                               | Instant cloud-based chat inference (0 RAM usage)    |
| **Embeddings** | FastEmbed (all-MiniLM-L6-v2)                    | Lightweight ONNX-based vector generation (~90MB)    |
| **RAG Engine** | LlamaIndex                                      | Document chunking, retrieval, and context management |
| **Vector Store**| Supabase pgvector (Persistent)                 | Cloud-based vector storage for 100% persistence     |
| **Database**   | Supabase (PostgreSQL)                           | User Auth, Chat History, Session Management         |
| **Hosting**    | Render (Free Tier)                              | Managed web service with 512MB RAM restriction      |

---

## 2. Backend API Endpoints

| Method | Endpoint | Auth Required | Purpose |
| ------ | -------- | ------------- | ------- |
| **GET** | `/` | No | API heartbeat and root status check. |
| **GET** | `/health` | No | Deep health check for deployment monitoring. |
| **POST** | `/upload` | Yes | Uploads documents and triggers isolated RAG indexing. |
| **POST** | `/chat` | Yes | Primary AI chat endpoint for document querying. |
| **GET** | `/chat/sessions/{id}` | Yes | Retrieves list of past chat sessions for a user. |
| **GET** | `/chat/messages/{id}` | Yes | Fetches full message history for a specific session. |
| **DELETE** | `/chat/session/{id}` | Yes | Securely wipes a chat session and its messages. |
| **GET** | `/user/me` | Yes | Retrieves the profile of the currently authenticated user. |

---

## 3. Database Schema (Supabase)

The platform relies on three core tables to manage the RAG (Retrieval-Augmented Generation) lifecycle:

| Table | Columns | Purpose |
| :--- | :--- | :--- |
| **`chat_sessions`** | `id`, `user_id`, `title`, `created_at` | Tracks individual chat conversations for the sidebar history. |
| **`chat_messages`** | `id`, `session_id`, `role`, `content`, `created_at` | Stores the actual dialogue (User vs. AI) for each session. |
| **`documents`** | `id`, `user_id`, `content`, `metadata`, `embedding` | Stores document chunks and their **pgvector** embeddings for AI search. |

---

## 4. Environment Variables (.env)

| Variable | Purpose | Description |
| -------- | ------- | ----------- |
| `GROQ_API_KEY` | AI Inference | Authenticates the backend with Groq for Llama 3 reasoning. |
| `SUPABASE_URL` | Cloud DB | The API URL for your hosted Supabase PostgreSQL project. |
| `SUPABASE_KEY` | Public Auth | Used by the client to interact with Supabase authentication. |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB | Used for high-privilege backend operations (like deleting sessions). |
| `SUPABASE_DB_URL` | Vector DB | The direct PostgreSQL connection string for pgvector operations. |

---

## 5. High-Level System Flow

```mermaid
graph TD
    User[User / Browser] -- Upload PDF --> API[FastAPI Backend]
    API -- Save Isolated --> Storage[User-Specific Folder]
    API -- Chunk & Embed --> FastEmbed[FastEmbed Engine]
    FastEmbed -- Store --> Supabase[Supabase pgvector DB]
    
    User -- Message --> ChatAPI[Chat Endpoint]
    ChatAPI -- Retrieval --> Supabase
    Supabase -- Context --> LLM[Groq Llama 3 API]
    LLM -- Response --> ChatAPI
    ChatAPI -- Result --> User
```

---

## 6. Core Backend Components

| Component              | Responsibility                                                                 |
| ---------------------- | ------------------------------------------------------------------------------ |
| **Upload Manager**     | Validates and saves files to isolated directories: `app/data/uploads/{user_id}` |
| **Indexing Service**   | Streams documents, chunks text, and stores vectors in Supabase pgvector.        |
| **Chat Orchestrator**  | Retrieves history and context from Supabase to coordinate with the LLM.        |
| **Memory Guardian**    | Enforces `threads=1` and manual garbage collection to keep RAM under 512MB.     |

---

## 7. Authentication & Security

| Feature                | Implementation                                                                |
| ---------------------- | ----------------------------------------------------------------------------- |
| **OAuth 2.0**          | Secure login via Google & GitHub through Supabase Auth providers.             |
| **2FA (MFA)**          | App-based OTP verification using Supabase multi-factor infrastructure.         |
| **OAuth Passwordless** | Custom backend logic bypasses password checks for social login users.         |
| **Secure Deletion**    | Account deletion triggers cascading cleanup of all user-specific AI files.    |

---

## 8. Extreme Memory Optimizations

| Optimization           | Technology / Logic                                                            | Impact                                      |
| ---------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| **Engine Swap**        | Replaced PyTorch with FastEmbed (ONNX)                                        | Reduced idle RAM by 400MB+                  |
| **Model Scaling**      | Used `all-MiniLM-L6-v2` (~90MB)                                               | Smallest model with high parsing accuracy   |
| **Thread Control**     | Set `threads=1` for AI inference                                              | Prevented CPU/RAM spikes and timeouts       |
| **Cloud Offloading**   | Used Groq API for LLM reasoning                                               | Saved ~4GB of RAM (size of a local Llama 3) |
| **Build Optimization** | `download_model.py` pre-downloads AI during build                              | Eliminated cold-start indexing failures     |
| **Vector Storage**     | Swapped FAISS (RAM) for Supabase pgvector (DB) | Enabled 100% data persistence after restarts |

---

## 9. Data & AI Pipeline

```mermaid
graph TD
    %% Phase A: Ingestion
    A_Start[Phase A: Ingestion] --> A1[Upload PDF]
    A1 --> A2[Secure User Folder]
    A2 --> A3[Chunking - 512 chars]
    A3 --> A4[FastEmbed - MiniLM]
    A4 --> A5[Supabase pgvector DB]

    %% Phase B: Chatting
    B_Start[Phase B: Chatting] --> B1[User Question]
    B1 --> B2[Question Embedding]
    B2 --> B3[pgvector Similarity Search]
    B3 --> B4[Context Retrieval]
    B4 --> B5[Groq Llama 3 API]
    B5 --> B6[AI Response]

    %% Styles
    style A_Start fill:#f96,stroke:#333,stroke-width:4px
    style B_Start fill:#69f,stroke:#333,stroke-width:4px
```

### Phase A: Document Ingestion 
This occurs when a user uploads a PDF.

| Step | Action | Logic / Optimization |
| ---- | ------ | -------------------- |
| **1** | **File Isolation** | File is saved in `app/data/uploads/{user_id}/` to ensure private indexing. |
| **2** | **Chunking** | The PDF is broken into small, overlapping text blocks (512 characters each). |
| **3** | **Embedding** | Each block is sent to the **MiniLM model**. It turns text into a vector (list of numbers). |
| **4** | **Persistence** | Vectors are stored in the **Supabase `documents` table** with `pgvector`. This ensures data survives server restarts. |

### Phase B: The Chatting Phase
This occurs when a user asks a question.

| Step | Action | Logic / Optimization |
| ---- | ------ | -------------------- |
| **1** | **Question Embedding** | The user's question is translated into a vector using the same MiniLM model. |
| **2** | **Similarity Search** | The system runs a `match_documents` RPC call in Supabase to find the top 5 most relevant text chunks. |
| **3** | **Context Assembly** | The found chunks are packaged into a "Context Block" alongside the user's question. |
| **4** | **LLM Synthesis** | The question + context is sent to **Groq (Llama 3)** for instant processing. |
| **5** | **Storage** | Both the question and AI answer are saved to the Supabase `chat_messages` table. |

---

## 10. Multi-User Isolation Strategy

| Isolation Layer | Implementation Detail                                                                 |
| --------------- | ------------------------------------------------------------------------------------- |
| **File System** | Every user has a unique physical directory on the disk based on their Supabase UID.   |
| **AI Brain**    | The server utilizes Supabase Row Level Security (RLS). User A cannot query User B's embeddings. |
| **Context**     | Retrieval is strictly restricted to the logged-in `user_id` during every database query. |