from sqlalchemy.orm import Session
from database.models import APIRequestMetric, EndpointBaseline, AnomalyResult, Endpoint
import structlog
import ruptures as rpt
import numpy as np
from config import settings

logger = structlog.get_logger()

def process_new_anomalies(db: Session, upload_id: int):
    # Get all metrics for this upload
    new_metrics = db.query(APIRequestMetric).filter(
        APIRequestMetric.upload_id == upload_id
    ).all()
    
    if not new_metrics:
        return
        
    endpoints = {m.endpoint_id for m in new_metrics}
    
    anomalies_to_insert = []
    
    for ep_id in endpoints:
        baseline = db.query(EndpointBaseline).filter(EndpointBaseline.endpoint_id == ep_id).first()
        if not baseline:
            continue
            
        ep_metrics = [m for m in new_metrics if m.endpoint_id == ep_id]
        
        # 1. Rolling average + STD threshold detection
        # 2. Change point detection (ruptures) on the series
        
        timeseries = sorted(ep_metrics, key=lambda x: x.timestamp)
        latencies = np.array([m.response_time for m in timeseries])
        
        # Change point detection (Pelt)
        if len(latencies) >= settings.MIN_DATA_POINTS:
            algo = rpt.Pelt(model="rbf").fit(latencies)
            # Find change points with a penalty
            # lower penalty = more change points
            result = algo.predict(pen=settings.RUPTURES_PENALTY)
            change_points = set(result[:-1]) # last element is length of array
        else:
            change_points = set()

        for idx, m in enumerate(timeseries):
            is_anomaly = False
            reason = ""
            score = 0.0
            
            # Simple threshold check
            threshold = baseline.mean_latency + (settings.Z_SCORE_THRESHOLD_MULTIPLIER * baseline.std_dev_latency)
            if m.response_time > threshold:
                is_anomaly = True
                reason = "Z-Score Threshold Exceeded"
                score = (m.response_time - baseline.mean_latency) / baseline.std_dev_latency
                
            # Change point hit
            if idx in change_points:
                is_anomaly = True
                reason = "Change Point Detected"
                score = max(score, 5.0) # High severity
                
            if is_anomaly:
                ar = AnomalyResult(
                    metric_id=m.id,
                    is_anomaly=True,
                    severity_score=float(score),
                    reason=reason
                )
                anomalies_to_insert.append(ar)
                
    if anomalies_to_insert:
        db.add_all(anomalies_to_insert)
        db.commit()
        logger.info("anomalies_detected", count=len(anomalies_to_insert), upload_id=upload_id)
