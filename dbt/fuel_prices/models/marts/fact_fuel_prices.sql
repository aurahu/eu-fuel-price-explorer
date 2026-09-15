SELECT *
FROM {{ ref('stg_weekly_prices') }}
WHERE fuel_type IN ('petrol_95', 'diesel')