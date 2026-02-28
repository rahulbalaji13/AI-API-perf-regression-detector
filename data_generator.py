import csv
import json
import random
import uuid
from datetime import datetime, timedelta

def generate_data(num_records=5000, file_format="csv"):
    endpoints = [
        "/api/users",
        "/api/auth/login",
        "/api/checkout",
        "/api/search",
        "/api/dashboard"
    ]
    
    # Introduce an artificial regression for checkout after midway point
    
    data = []
    base_time = datetime.utcnow() - timedelta(days=7)
    
    for i in range(num_records):
        current_time = base_time + timedelta(minutes=i*2)
        endpoint = random.choice(endpoints)
        
        # Base latency
        if endpoint == "/api/checkout":
            latency = random.normalvariate(150, 20)
            
            # Regression after midway
            if i > num_records // 2:
                # Sudden spike and increased baseline
                latency = random.normalvariate(400, 50)
                deployment_version = "v2.1.0"
            else:
                deployment_version = "v2.0.0"
        else:
            latency = random.normalvariate(50 + endpoints.index(endpoint)*20, 10)
            deployment_version = "v2.0.0" if i < num_records // 2 else "v2.1.0"
            
        # Random anomaly spike (1% chance)
        if random.random() < 0.01:
            latency *= random.uniform(3, 5)
            
        status_code = 200
        if random.random() < 0.05:
            status_code = random.choice([400, 401, 403, 404, 500])
            
        record = {
            "timestamp": current_time.isoformat() + "Z",
            "endpoint": endpoint,
            "response_time": max(10, round(latency, 2)),
            "status_code": status_code,
            "deployment_version": deployment_version
        }
        data.append(record)
        
    if file_format == "csv":
        with open("sample_logs.csv", "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=data[0].keys())
            writer.writeheader()
            writer.writerows(data)
    else:
        with open("sample_logs.json", "w") as f:
            json.dump(data, f, indent=2)
            
    print(f"Generated {num_records} records in sample_logs.{file_format}")

if __name__ == "__main__":
    generate_data(num_records=10000, file_format="csv")
