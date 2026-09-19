import requests
import pandas as pd
from io import BytesIO
from datetime import datetime, timezone
from ingestion.fuel_pipeline.database.get_conn import get_connection

SOURCE_URL = "https://energy.ec.europa.eu/document/download/264c2d0f-f161-4ea3-a777-78faae59bea0_en?filename=Weekly%20Oil%20Bulletin%20Weekly%20prices%20with%20Taxes%20-%202024-02-19.xlsx"

# Downloading
print("Downloading source file...")

response = requests.get(
    SOURCE_URL,
    timeout=30
)

response.raise_for_status()

print(f"Downloaded {len(response.content) / 1024:.1f} KB")

print("Reading Excel file...")

#Reading
df = pd.read_excel(BytesIO(response.content))

print("Excel file loaded.")

# Removing whitespace from all column names
df.columns = df.columns.str.strip()

# Extracting observation date
# In the .xlsx file, the 2nd row includes the observation date, while 1st row includes column names.
observed_date = pd.to_datetime(df.iloc[0, 0]).date()

# Adding pipeline metadata
ingested_at = datetime.now(timezone.utc)

# Extracting actual observations
data = df.iloc[1:].copy()


# MINIMAL CLEAN-UP

# Renaming column names
data = data.rename(columns={
    "in EUR": "country",
    "Euro-super 95  (I)": "petrol_95",
    "Gas oil automobile Automotive gas oil Dieselkraftstoff (I)": "diesel",
    "Gas oil de chauffage Heating gas oil Heizöl (II)": "heating_gas_oil",
    "Fuel oil - Schweres Heizöl (III) Soufre": "fuel_oil_low_sulphur",
    "Fuel oil -Schweres Heizöl (III) Soufre > 1% Sulphur > 1% Schwefel > 1%": "fuel_oil_high_sulphur",
    "GPL pour moteur LPG motor fuel": "lpg"})

# Removing last two rows (contains weighted averages, which are not needed)
data = data.iloc[:-2]

# Adding pipeline metadata & observation date
data["observed_date"] = observed_date
data["ingested_at"] = ingested_at
data["source_url"] = SOURCE_URL

# Converting pandas NaN to Python None
data = data.where(pd.notna(data), None)

# Preparing rows for patch insertion
rows = list(
    data[
        [
            "country",
            "petrol_95",
            "diesel",
            "heating_gas_oil",
            "fuel_oil_low_sulphur",
            "fuel_oil_high_sulphur",
            "lpg",
            "observed_date",
            "ingested_at",
            "source_url",
        ]
    ].itertuples(index=False, name=None)
)

print("Connecting to database...")

# Load data into PostgreSQL
with get_connection() as connection:
    with connection.cursor() as cursor:
        cursor.executemany(
            """
            INSERT INTO raw_weekly_prices (
                country,
                petrol_95,
                diesel,
                heating_gas_oil,
                fuel_oil_low_sulphur,
                fuel_oil_high_sulphur,
                lpg,
                observed_date,
                ingested_at,
                source_url
            )
            VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            ON CONFLICT (country, observed_date) DO NOTHING;
            """,
            rows
        )

print(f"Source observation date: {observed_date}")
print(f"Attempted to load {len(rows)} rows.")
