WITH source AS (

    SELECT *
    FROM {{ source('raw', 'raw_historical_prices') }}

),

unpivoted AS (

    SELECT
        observed_date,
        ingested_at,
        key AS column_name,
        value
    FROM source
    CROSS JOIN LATERAL jsonb_each(
        to_jsonb(source)
    )
    
),

historical_prices AS (

    SELECT
        UPPER(SPLIT_PART(column_name, '_price_with_tax_', 1)) AS country_code,

        CASE
            WHEN column_name LIKE '%_euro95' THEN 'petrol_95'
            WHEN column_name LIKE '%_diesel' THEN 'diesel'
            WHEN column_name LIKE '%_heating_oil' THEN 'heating_gas_oil'
            WHEN column_name LIKE '%_fuel_oil_1' THEN 'fuel_oil_low_sulphur'
            WHEN column_name LIKE '%_fuel_oil_2' THEN 'fuel_oil_high_sulphur'
            WHEN column_name LIKE '%_lpg' THEN 'lpg'
        END AS fuel_type,

        NULLIF(value #>> '{}', 'NaN')::NUMERIC / 1000.0 AS price_eur_per_litre,

        observed_date,
        ingested_at

    FROM unpivoted

    WHERE column_name LIKE '%_price_with_tax_%'
        AND column_name NOT LIKE 'eu_price_with_tax_%'
        AND column_name NOT LIKE 'eur_price_with_tax_%'
        AND column_name NOT LIKE 'uk_price_with_tax_%'

),

country_mapping AS (
    SELECT *
    FROM {{ ref('country_codes') }}
),

final AS (
    SELECT
        m.country,
        h.country_code,
        h.fuel_type,
        h.price_eur_per_litre,
        h.observed_date,
        h.ingested_at
    FROM historical_prices AS h
    LEFT JOIN {{ ref('country_codes') }} AS m
        ON h.country_code = m.country_code
)

SELECT *
FROM final
WHERE price_eur_per_litre IS NOT NULL