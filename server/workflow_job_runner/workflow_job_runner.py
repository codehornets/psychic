import io
from fastapi import UploadFile
from typing import List, Optional, Tuple, Dict
from models.models import (
    AppConfig,
    User,
    Workflow,
    Edge,
    WorkflowRunStatus,
    WorkflowRun,
)
from supabase import create_client, Client
import os
from storage3.utils import StorageException

from io import StringIO
from bs4 import BeautifulSoup
import pandas as pd
import httpx
import datetime
import tempfile
import pdb
from collections import deque
from database import Database
import json
from google.cloud import run_v2
from google.oauth2 import service_account


class WorkflowJobRunner:
    def __init__(self, db: Database, config: AppConfig):
        self.db = db
        self.config = config
        service_account_info = json.loads(os.getenv("GCLOUD_SERVICE_ACCOUNT"))
        self.credentials = service_account.Credentials.from_service_account_info(
            service_account_info
        )

    async def start_job(self, workflow_id: str) -> WorkflowRun:
        client = run_v2.JobsClient(credentials=self.credentials)
        project = os.getenv("GCLOUD_PROJECT")
        location = os.getenv("GCLOUD_LOCATION")
        job = os.getenv("GCLOUD_JOB_NAME")
        request = run_v2.RunJobRequest(
            name=f"projects/{project}/locations/{location}/jobs/{job}",
            overrides={
                "container_overrides": [
                    {
                        "env": [
                            {"name": "WORKFLOW_ID", "value": workflow_id},
                        ]
                    }
                ]
            },
        )
        operation = client.run_job(request)
        print(f"Started job: {operation}")
        # update the workflow run status to running
        run = WorkflowRun(
            workflow_id=workflow_id,
            status=WorkflowRunStatus.running,
        )
        await self.db.save_workflow_run(
            workflow_run=run,
        )
        return run

    async def get_run_status(self, workflow_id: str) -> WorkflowRun:
        run = self.db.get_workflow_run(workflow_id)
        return run
