set -e

ENV_FILE="$(dirname "$0")/../.env"
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

echo "[INIT] Starting database check..."

export PGPASSWORD="${DB_DEFAULT_PASSWORD:-}"

DB_NAME="${DB_DEFAULT_DATABASE:-b2c_db}"
DB_USER="${DB_DEFAULT_USERNAME:-postgres}"
DB_PORT="${DB_DEFAULT_PORT:-5432}"
DB_HOST="${DB_DEFAULT_HOST:-localhost}"
DB_BASE="postgres"

echo "[INFO] Target database: $DB_NAME"
echo "[INFO] Connecting as user: $DB_USER@$DB_HOST:$DB_PORT"

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; do
  echo "[WAIT] Waiting for PostgreSQL to become available..."
  sleep 2
done

EXISTS=$(psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_BASE" -tAc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'")

if [ "$EXISTS" = "1" ]; then
  echo "[SKIP] Database '$DB_NAME' already exists. Skipping creation."
else
  echo "[ACTION] Creating database '$DB_NAME'..."
  createdb -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME"
  echo "[DONE] Database '$DB_NAME' successfully created."
fi
