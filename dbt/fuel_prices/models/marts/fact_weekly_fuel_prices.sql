SELECT
    country,
    country_code,
    fuel_type,
    price_eur_per_litre,
    observed_date
FROM {{ ref('fact_historical_fuel_prices') }}
WHERE observed_date = (
    SELECT MAX(observed_date)
    FROM {{ ref('fact_historical_fuel_prices') }}
)