WITH source_data AS (

    SELECT *
    FROM {{ source('raw', 'raw_weekly_prices') }}

),

-- Turning petrol/diesel/heating gas etc. columns into rows.
-- Converted from EUR/1000L to EUR/L.
unpivoted_and_converted AS (
    SELECT
    country,
    'petrol_95' AS fuel_type,
    petrol_95 / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data

    UNION ALL

    SELECT
    country,
    'diesel' AS fuel_type,
    diesel / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data

    UNION ALL

    SELECT
    country,
    'heating_gas_oil' AS fuel_type,
    heating_gas_oil / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data

    UNION ALL

    SELECT
    country,
    'fuel_oil_low_sulphur' AS fuel_type,
    fuel_oil_low_sulphur / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data

    UNION ALL 

    SELECT
    country,
    'fuel_oil_high_sulphur' AS fuel_type,
    fuel_oil_high_sulphur / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data

    UNION ALL 

    SELECT
    country,
    'lpg' AS fuel_type,
    lpg / 1000.0 AS price_eur_per_litre,
    observed_date
    FROM source_data
),

cleaned AS (
    SELECT *
    FROM unpivoted_and_converted
    WHERE price_eur_per_litre IS NOT NULL
)

SELECT *
FROM cleaned
ORDER BY country