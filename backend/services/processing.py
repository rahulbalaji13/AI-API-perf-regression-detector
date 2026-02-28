import pandas as pd
import io
import json
from sqlalchemy.orm import Session
from datetime import datetime
from database.models import Endpoint, APIRequestMetric
import structlog

logger = structlog.get_logger()

def process_log_file(db: Session, upload_id: int, content: bytes, file_ext: str) -> int:
    try:
        if file_ext == "csv":
            df = pd.read_csv(io.BytesIO(content))
        else:
            data = json.loads(content.decode('utf-8'))
            df = pd.DataFrame(data)

        # Standardize columns
        expected_cols = ["timestamp", "endpoint", "response_time", "status_code", "deployment_version"]
        if not all(col in df.columns for col in expected_cols):
            logger.error("missing_columns", 
                       expected=expected_cols, 
                       found=list(df.columns))
            return 0
            
        df["timestamp"] = pd.to_datetime(df["timestamp"])
        df = df.dropna(subset=expected_cols)
        
        # Upsert endpoints
        unique_endpoints = df["endpoint"].unique()
        endpoint_map = {}
        for ep_path in unique_endpoints:
            db_ep = db.query(Endpoint).filter(Endpoint.path == ep_path).first()
            if not db_ep:
                db_ep = Endpoint(path=ep_path)
                db.add(db_ep)
                db.flush()
                db.commit()
            endpoint_map[ep_path] = db_ep.id
            
        # Map endpoint to integer ID
        df["endpoint_id"] = df["endpoint"].map(endpoint_map)
        
        # Batch insert metrics
        metrics = []
        for _, row in df.iterrows():
            metric = APIRequestMetric(
                timestamp=row["timestamp"],
                endpoint_id=row["endpoint_id"],
                response_time=float(row["response_time"]),
                status_code=int(row["status_code"]),
                deployment_version=str(row["deployment_version"]),
                upload_id=upload_id
            )
            metrics.append(metric)
            
            # Commit in batches of 1000
            if len(metrics) >= 1000:
                db.add_all(metrics)
                db.commit()
                metrics = []
                
        if metrics:
            db.add_all(metrics)
            db.commit()
            
        logger.info("ingested_records", count=len(df), upload_id=upload_id)
        return len(df)
        
    except Exception as e:
        logger.error("error_processing", error=str(e), upload_id=upload_id)
        return 0

def train_baselines(db: Session, upload_id: int):
    from ml.baseline import update_baselines
    update_baselines(db)

def detect_anomalies(db: Session, upload_id: int):
    from ml.anomaly import process_new_anomalies
    process_new_anomalies(db, upload_id)
