from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .database import Base

class Upload(Base):
    __tablename__ = "uploads"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=func.now(), nullable=False)
    total_records = Column(Integer, default=0)
    
    metrics = relationship("APIRequestMetric", back_populates="upload")

class Endpoint(Base):
    __tablename__ = "endpoints"
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    
    metrics = relationship("APIRequestMetric", back_populates="endpoint")
    baseline = relationship("EndpointBaseline", back_populates="endpoint", uselist=False)

class APIRequestMetric(Base):
    __tablename__ = "metrics"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, index=True, nullable=False) # Will be converted to hypertable
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), index=True, nullable=False)
    response_time = Column(Float, nullable=False)
    status_code = Column(Integer, nullable=False)
    deployment_version = Column(String, index=True)
    upload_id = Column(Integer, ForeignKey("uploads.id"), nullable=True)
    
    endpoint = relationship("Endpoint", back_populates="metrics")
    upload = relationship("Upload", back_populates="metrics")

class EndpointBaseline(Base):
    __tablename__ = "endpoint_baselines"
    id = Column(Integer, primary_key=True, index=True)
    endpoint_id = Column(Integer, ForeignKey("endpoints.id"), unique=True)
    last_updated = Column(DateTime, default=func.now())
    mean_latency = Column(Float)
    std_dev_latency = Column(Float)
    p95_latency = Column(Float)
    model_data = Column(JSONB) # Store serialized IsolationForest or thresholds
    
    endpoint = relationship("Endpoint", back_populates="baseline")

class AnomalyResult(Base):
    __tablename__ = "anomaly_results"
    id = Column(Integer, primary_key=True, index=True)
    metric_id = Column(Integer, ForeignKey("metrics.id"), unique=True, nullable=False)
    is_anomaly = Column(Boolean, default=False)
    severity_score = Column(Float, default=0.0)
    reason = Column(String, nullable=True)
    detected_at = Column(DateTime, default=func.now())
