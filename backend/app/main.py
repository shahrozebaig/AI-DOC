import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.api.upload import router as upload_router
from app.api.health import router as health_router
from app.api.user import router as user_router 
from app.api.face import router as face_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/chat")
app.include_router(upload_router, prefix="/upload")
app.include_router(health_router, prefix="/health")
app.include_router(user_router, prefix="/user")
app.include_router(face_router, prefix="/face")
