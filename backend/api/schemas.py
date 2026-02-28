from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UploadResponse(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    total_records: int

    class Config:
        from_attributes = True

class EndpointResponse(BaseModel):
    id: int
    path: str
    
    class Config:
        from_attributes = True

class AnomalySummary(BaseModel):
    total_anomalies: int
    avg_severity: float
    affected_endpoints: List[str]

class DeploymentComparisonReq(BaseModel):
    endpoint: str
    version_a: str
    version_b: str

class RegressionReport(BaseModel):
    endpoint: str
    version_a_metrics: dict
    version_b_metrics: dict
    regression_detected: bool
    regression_score: float
