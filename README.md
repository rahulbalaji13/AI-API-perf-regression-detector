# AI API Performance Regression Detector

A production-grade full-stack system that detects API latency regressions and performance anomalies after deployments using time-series analysis and anomaly detection. 

## Features
- **Upload API Logs:** Ingest CSV or JSON logs with timestamps, endpoints, latency, and deployment metadata.
- **Automated Baseline Learning:** Trains baseline Isolation Forest models for each endpoint.
- **Anomaly & Change Point Detection:** Uses Z-score thresholding combined with the Raptures library for change point detection.
- **TimescaleDB Integration:** Optimized for time-series operations.
- **Executive Dashboard:** Visualize latency regressions over time, view anomaly events, and examine endpoint health on a deployment heatmap.

## Architecture & Tech Stack

### Frontend (Next.js + TailwindCSS)
- `App Router` with server/client components
- `Recharts` for interactive time-series plots
- `Lucide React` for scalable icons 
- `TailwindCSS` with glassmorphism UI elements for a premium look

### Backend (FastAPI)
- `SQLAlchemy + TimescaleDB` for highly performant metadata and metrics storage
- `Background Tasks` for asynchronous ML training on large files
- `Scikit-Learn (Isolation Forest)` for multidimensional anomaly scoring
- `Ruptures` for un-supervised change point detection in the latency series

## Setup & Running Locally

1. **Spin up the stack with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend Dashboard: `http://localhost:3000`
   - Backend API Docs: `http://localhost:8000/docs`

3. **Generate Sample Data:**
   You can run the python script `data_generator.py` at the root directory to generate an artificial set of deployment logs with controlled anomalies and regressions:
   ```bash
   python data_generator.py
   ```
   Upload the generated `sample_logs.csv` to the dashboard to test the real-time regressions detection!
