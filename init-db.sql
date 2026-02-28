# Create TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Optional: Create initial user (if using custom roles)
-- CREATE ROLE api_perf_user WITH LOGIN PASSWORD 'password';
-- GRANT ALL PRIVILEGES ON DATABASE api_perf_db TO api_perf_user;
