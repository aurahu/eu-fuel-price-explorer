import requests
import pandas as pd
from io import BytesIO
from datetime import datetime, timezone
from ingestion.fuel_pipeline.database.get_conn import get_connection

SOURCE_URL = "https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en?filename=Weekly_Oil_Bulletin_Prices_History_maticni_4web.xlsx"

# Downloading
print("Downloading source file...")
response = requests.get(
    SOURCE_URL,
    timeout=30
)

content_type = response.headers.get("Content-Type", "")

if not response.content:
    raise RuntimeError("Source file is empty.")

print(f"Downloaded {len(response.content) / 1024:.1f} KB")

#Reading
print("Reading Excel file...")

df = pd.read_excel(
    BytesIO(response.content),
    sheet_name="Prices with taxes"
)

print("Excel file loaded.")

# Removing whitespace from all column names and turning to lowercase
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(".", "_", regex=False)
)

# Renaming duplicate column names
new_columns = []

for idx, col in enumerate(df.columns):
    # Count how many times this column name has already appeared before the current position
    previous_columns = df.columns[:idx]
    count = previous_columns.tolist().count(col)
    
    if count == 0:
        # First time we see this name -> keep it as is
        new_name = col
    else:
        # Duplicate -> add a suffix (_1, _2, ...)
        new_name = f"{col}_{count}"
    
    new_columns.append(new_name)

# Replace the old column names
df.columns = new_columns

# Creating pipeline metadata
ingested_at = datetime.now(timezone.utc)

# Skip the metadata/header rows and keep the actual observations
data = df.iloc[2:].copy()

# MINIMAL CLEAN-UP

# Renaming column names
data = data.rename(columns={
    "consumer prices of petroleum products inclusive of duties and taxes": "observed_date"
    })

# Remove notes/footer rows
data = data[pd.to_datetime(data["observed_date"], errors="coerce").notna()]

# Adding pipeline metadata
data["ingested_at"] = ingested_at
data["source_url"] = SOURCE_URL

# Converting pandas NaN to Python None
data = data.where(pd.notna(data), None)

# Preparing rows automatically for patch insertion
rows = list(data.itertuples(index=False, name=None))

columns = list(data.columns)
column_names = ", ".join(columns)
placeholders = ", ".join(["%s"] * len(columns))

columns = []

for column in data.columns:
    if column == "observed_date":
        sql_type = "DATE"
    elif column == "ingested_at":
        sql_type = "TIMESTAMPTZ"
    elif column in ["source_url", "country"] or column.startswith("ctr"):
        sql_type = "TEXT"
   
    else:
        sql_type = "NUMERIC"

    columns.append(f'"{column}" {sql_type}')

create_table_query = f"""
    CREATE TABLE IF NOT EXISTS raw_historical_prices (
        id BIGSERIAL PRIMARY KEY,
        {", ".join(columns)},
        CONSTRAINT unique_historical_observation
            UNIQUE (observed_date)
    );
"""

insert_query = f"""
    INSERT INTO raw_historical_prices ({column_names})
    VALUES ({placeholders})
    ON CONFLICT (observed_date) DO NOTHING;
"""

with get_connection() as connection:
    with connection.cursor() as cursor:
        cursor.execute(create_table_query)
        cursor.executemany(insert_query, rows)

        print(f"Rows found: {len(rows)}")
