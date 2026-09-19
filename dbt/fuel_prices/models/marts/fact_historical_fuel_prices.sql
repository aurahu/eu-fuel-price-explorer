SELECT *
FROM {{ ref('stg_historical_prices') }}
WHERE fuel_type IN ('petrol_95', 'diesel')