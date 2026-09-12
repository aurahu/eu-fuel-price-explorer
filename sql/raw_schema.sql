CREATE TABLE raw_weekly_prices (
    id BIGSERIAL PRIMARY KEY,

    country TEXT,

    petrol_95 NUMERIC,
    diesel NUMERIC,
    heating_gas_oil NUMERIC,
    fuel_oil_low_sulphur NUMERIC,
    fuel_oil_high_sulphur NUMERIC,
    lpg NUMERIC,

    observed_date DATE,
    ingested_at TIMESTAMPTZ,
    source_url TEXT,

    CONSTRAINT unique_country_observation
        UNIQUE (country, observed_date)
);