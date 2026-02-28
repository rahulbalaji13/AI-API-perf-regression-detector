from fastapi import APIRouter, File, UploadFile, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from database.database import get_db
from database.models import Upload, Endpoint, APIRequestMetric
from services.processing import process_log_file, train_baselines, detect_anomalies
from api.schemas import UploadResponse, DeploymentComparisonReq, RegressionReport

router = APIRouter()

@router.post("/upload/", response_model=UploadResponse)
async def upload_logs(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(('.csv', '.json')):
        raise HTTPException(status_code=400, detail="Only CSV or JSON files are allowed")
    
    # Read content to memory, or save to disk for background processing
    content = await file.read()
    
    db_upload = Upload(filename=file.filename)
    db.add(db_upload)
    db.commit()
    db.refresh(db_upload)
    
    file_ext = file.filename.split('.')[-1]
    
    # Process file asynchronously
    background_tasks.add_task(
        process_async_pipeline,
        db_upload.id,
        content,
        file_ext
    )
    
    return db_upload

def process_async_pipeline(upload_id: int, content: bytes, file_ext: str):
    from database.database import SessionLocal
    db = SessionLocal()
    try:
        # 1. Parse and insert logs
        num_records = process_log_file(db, upload_id, content, file_ext)
        upload = db.query(Upload).filter(Upload.id == upload_id).first()
        upload.total_records = num_records
        db.commit()
        
        # 2. Train baseline models
        train_baselines(db)
        
        # 3. Detect anomalies on the new dataset
        detect_anomalies(db, upload_id)
    except Exception as e:
        import structlog
        logger = structlog.get_logger()
        logger.error("pipeline_error", error=str(e))
    finally:
        db.close()

@router.get("/dashboard/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Returns top level KPIs for the dashboard"""
    from services.reporting import get_summary_stats
    return get_summary_stats(db)

@router.get("/endpoints/heatmap")
def get_endpoint_heatmap(db: Session = Depends(get_db)):
    """Returns endpoint latency heatmap vs anomalies"""
    from services.reporting import get_heatmap_data
    return get_heatmap_data(db)

@router.get("/metrics/timeseries")
def get_timeseries_data(
    endpoint: str = None, 
    start_time: str = None,
    end_time: str = None,
    db: Session = Depends(get_db)
):
    from services.reporting import get_timeseries
    return get_timeseries(db, endpoint, start_time, end_time)

@router.get("/deployments/compare")
def compare_deployments(
    version_a: str,
    version_b: str,
    endpoint: str = None,
    db: Session = Depends(get_db)
):
    from services.reporting import compare_versions
    return compare_versions(db, version_a, version_b, endpoint)
