from sqlalchemy.orm import Session
from database.models import Endpoint, EndpointBaseline, APIRequestMetric
import pandas as pd
import numpy as np
import pickle
import structlog
from sklearn.ensemble import IsolationForest
from config import settings

logger = structlog.get_logger()

def update_baselines(db: Session):
    endpoints = db.query(Endpoint).all()
    
    for ep in endpoints:
        # Check if we have enough data (at least 100 points previous to last 2 deployments)
        # Simplified: Just grab all data for now to train a baseline
        metrics = db.query(APIRequestMetric.response_time).filter(
            APIRequestMetric.endpoint_id == ep.id
        ).all()
        
        if len(metrics) < 100:
            continue
            
        latencies = [m[0] for m in metrics]
        df = pd.DataFrame({"latency": latencies})
        
        mean_lat = df["latency"].mean()
        std_lat = df["latency"].std()
        p95_lat = df["latency"].quantile(0.95)
        
        # Train Isolation Forest
        clf = IsolationForest(contamination=settings.ANOMALY_CONTAMINATION, random_state=settings.ANOMALY_RANDOM_STATE)
        clf.fit(df[["latency"]])
        
        # Serialize model (use basic hex representation for JSONB compatibility or just hex string)
        model_data = clf.get_params() # Simple approach. In prod, save artifacts to S3
        
        baseline = db.query(EndpointBaseline).filter(EndpointBaseline.endpoint_id == ep.id).first()
        if not baseline:
            baseline = EndpointBaseline(endpoint_id=ep.id)
            db.add(baseline)
            
        baseline.mean_latency = float(mean_lat)
        baseline.std_dev_latency = float(std_lat)
        baseline.p95_latency = float(p95_lat)
        baseline.model_data = model_data
        
        db.commit()
        logger.info("baseline_updated", endpoint=ep.path, mean=mean_lat)
