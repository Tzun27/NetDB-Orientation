from pydantic_settings import BaseSettings
from typing import Any, Dict, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Todo Backend"
    DATABASE_URL: str = "postgresql://postgres:postgresmaster@localhost:5433/postgres"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings() 