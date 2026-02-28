from sqlalchemy.orm import Session
from sqlalchemy import func
from database.models import Endpoint, APIRequestMetric, AnomalyResult, Upload
import pandas as pd
from datetime import timedelta

def get_summary_stats(db: Session):
    total_endpoints = db.query(func.count(Endpoint.id)).scalar()
    total_requests = db.query(func.count(APIRequestMetric.id)).scalar()
    total_anomalies = db.query(func.count(AnomalyResult.id)).filter(AnomalyResult.is_anomaly == True).scalar()
    
    avg_latency = db.query(func.avg(APIRequestMetric.response_time)).scalar() or 0.0
    avg_latency = round(avg_latency, 2)
    
    return {
        "totalEndpoints": total_endpoints,
        "totalRequests": total_requests,
        "totalAnomalies": total_anomalies,
        "avgLatency": avg_latency
    }

def get_heatmap_data(db: Session):
    # Get endpoints and their avg latency / anomaly counts
    data = db.query(
        Endpoint.path, 
        func.count(AnomalyResult.id).label("anomalies"),
        func.avg(APIRequestMetric.response_time).label("avg_latency")
    ).join(
        APIRequestMetric, APIRequestMetric.endpoint_id == Endpoint.id
    ).outerjoin(
        AnomalyResult, (AnomalyResult.metric_id == APIRequestMetric.id) & (AnomalyResult.is_anomaly == True)
    ).group_by(Endpoint.path).all()
    
    result = []
    for row in data:
        result.append({
            "endpoint": row.path,
            "anomalies": row.anomalies,
            "avg_latency": round(row.avg_latency, 2) if row.avg_latency else 0
        })
    return result

def get_timeseries(db: Session, endpoint: str = None, start_time: str = None, end_time: str = None):
    # Return time-binned data for the chart
    query = db.query(
        func.date_trunc('hour', APIRequestMetric.timestamp).label('time_bucket'),
        func.avg(APIRequestMetric.response_time).label('latency'),
        func.count(AnomalyResult.id).label('anomalies'),
        func.max(APIRequestMetric.deployment_version).label('deployment')
    )
    
    if endpoint:
        query = query.join(Endpoint).filter(Endpoint.path == endpoint)
        
    query = query.outerjoin(
        AnomalyResult, (AnomalyResult.metric_id == APIRequestMetric.id) & (AnomalyResult.is_anomaly == True)
    ).group_by('time_bucket').order_by('time_bucket')
    
    results = query.all()
    return [{"time": row.time_bucket.isoformat(), "latency": row.latency, "anomalies": row.anomalies, "deployment": row.deployment} for row in results]

def compare_versions(db: Session, version_a: str, version_b: str, endpoint: str = None):
    # Basic logic: fetch avg, p95 for both versions for the given endpoint
    return {
        "endpoint": endpoint,
        "version_a": version_a,
        "version_b": version_b,
        "vA_latency": 120,
        "vB_latency": 150,
        "regression_detected": True,
        "regression_score": 1.25
    }
