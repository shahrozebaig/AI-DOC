<p align="center">
  <img src="frontend/public/Logo.jpeg" alt="Banner" width="55%">
</p>

## Overview

DocuMind AI is an advanced document-based conversational platform that enables users to upload files such as PDFs and interact with them using natural language queries. Built using Retrieval-Augmented Generation (RAG) and large language models, the system delivers accurate, context-aware responses derived directly from user-provided documents. The platform is designed to simplify information retrieval, enhance productivity, and provide a secure, intelligent interface for working with large volumes of unstructured data.

---

## 🎥 Demo

https://github.com/user-attachments/assets/5132ed52-c7df-4a19-9a0e-2144bfa91d0b

---

## 🎥 Full Project Walkthrough (Loom)

Here is a full explanation of the project demonstrating features and workflow.

<p align="center">
  <a href="https://www.loom.com/share/1a8af684822a43e9b4b2518c406addc6">
    ▶️ Watch Full Project Walkthrough
  </a>
</p>

---

---

## 🛠️ System Architecture & Workflow

Below is the visual overview of how **DocuMind AI** processes documents, manages retrieval, and generates intelligent responses through its RAG pipeline.

<p align="center">
  <img src="frontend/public/Rag.jpeg" alt="RAG Pipeline Overview" width="90%">
</p>

---

## 💡 Troubleshooting & Performance Tips

To get the most out of **DocuMind AI** on the Render free tier (512MB RAM), please refer to the table below for handling common scenarios:

| Issue / Scenario | Recommended Action | Reason / Insight |
| :--- | :--- | :--- |
| **"Intelligence processing failed"** | **Refresh the page** and retry the upload. | The system hit a temporary RAM limit; refreshing resets the session state. |
| **Large Documents (10MB+)** | Split into smaller files (under 50 pages each). | Smaller chunks index much more reliably on low-resource hardware. |
| **Site feels slow at first** | Wait 10-15 seconds for the initial load. | Render is "waking up" the server from its "sleep" state. |
| **Long Indexing Spinner** | Stay on the page until it completes. | Deep parsing of complex PDFs takes time to ensure high retrieval accuracy. |

---

---

## Tech Stack

| Layer        | Technology Used                                 |
| ------------ | ----------------------------------------------- |
| Frontend     | React.js, Tailwind CSS                          |
| Backend      | FastAPI (Python)                                |
| AI Model     | Groq LLaMA 3.1 8B Instant                       |
| Embeddings   | FastEmbed (all-MiniLM-L6-v2)                    |
| RAG Engine   | LlamaIndex                                      |
| Vector Store | FAISS                                           |
| Database     | Supabase                                        |
| Auth         | Supabase Auth (Email, Google, GitHub, 2FA)      |
| Security     | OTP-based 2FA, Password Reset, Account Deletion |