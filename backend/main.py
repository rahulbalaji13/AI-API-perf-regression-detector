import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from database.models import Upload  # ensuring models are imported for create_all
from api.router import router as api_router
from sqlalchemy import text
import uvicorn

logger = structlog.get_logger()

# Create tables
Base.metadata.create_all(bind=engine)

# Convert metrics table to TimescaleDB hypertable if not already converted
try:
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS timescaledb;"))
        conn.commit()
        # Check if it's already a hypertable
        res = conn.execute(text("SELECT * FROM timescaledb_information.hypertables WHERE hypertable_name = 'metrics';")).fetchone()
        if not res:
            conn.execute(text("SELECT create_hypertable('metrics', 'timestamp', if_not_exists => TRUE);"))
            conn.commit()
            logger.info("Created hypertable for metrics")
except Exception as e:
    logger.error("Failed to create hypertable automatically. TimescaleDB might not be enabled.", error=str(e))


app = FastAPI(title="AI API Performance Regression Detector")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
