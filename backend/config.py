from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    ANOMALY_CONTAMINATION: float = 0.01
    ANOMALY_RANDOM_STATE: int = 42
    MIN_DATA_POINTS: int = 50
    Z_SCORE_THRESHOLD_MULTIPLIER: float = 3.0
    RUPTURES_PENALTY: float = 10.0
    
    class Config:
        env_file = ".env"

settings = Settings()
