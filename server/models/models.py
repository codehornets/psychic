import os
from pydantic import BaseModel, ConfigDict, Field, ValidationError
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any, Tuple, Type, Union
from enum import Enum
import datetime


class SessionStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"   
    RUNNING = "running"

class AppConfig(BaseModel):
    user_id: str
    app_id: str


class User(BaseModel):
    id: str
    created_at: datetime.datetime
    email: str
    secret_key: str
    avatar_url: str

class Session(BaseModel):
    id: str
    app_id: str
    agent_id: str
    status: SessionStatus
    browser_id: Optional[str] = None
    results: Optional[List[Dict]] = None
    error: Optional[Dict] = None

class Browser(BaseModel):
    id: str
    app_id: str
    state: Optional[Dict] = None

class FinicEnvironment(str, Enum):
    LOCAL = "local"
    DEV = "development"
    PROD = "production"

class Agent(BaseModel):
    id: str
    app_id: str
    name: str
    num_retries: int
