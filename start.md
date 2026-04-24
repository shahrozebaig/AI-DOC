# 🚀 Getting Started with DocuMind AI

Follow these steps to set up and run the **DocuMind AI** platform on your local machine.

---

## 📋 Prerequisites
Ensure you have the following installed and configured:
- **Python 3.10+**
- **Node.js 18+**
- **Supabase Account** (For Auth and Vector Database)
- **Groq API Key** (For AI Inference)
- **ML Model**: `all-MiniLM-L6-v2` (Automatically downloaded by FastEmbed during first run)

---

## 📂 1. Backend Setup (Python/FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend/` folder:
   ```env
   GROQ_API_KEY=your_groq_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[ID].supabase.co:5432/postgres
   ```

5. **Initialize the Database:**
   Copy the contents of `backend/db/schema.sql` and run it in the **SQL Editor** of your Supabase dashboard.

6. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload
   ```

---

## 💻 2. Frontend Setup (React)

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend/` folder:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

---

## 💡 Troubleshooting
- **RAM Issues**: If indexing fails, ensure no other heavy processes are running.
- **Persistence**: Ensure your `SUPABASE_DB_URL` is correct to allow `pgvector` to save your embeddings permanently.
- **Auth**: Double-check your Supabase Redirect URLs if social login fails.
