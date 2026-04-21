from supabase import create_client
from dotenv import load_dotenv
import os
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY")
if not url or not key:
    print("WARNING: SUPABASE_URL or SUPABASE_KEY missing in environment variables.")
supabase = create_client(url, key)