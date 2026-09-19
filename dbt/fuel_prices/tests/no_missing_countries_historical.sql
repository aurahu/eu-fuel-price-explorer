WITH latest_date AS (

    SELECT MAX(observed_date) AS observed_date
    FROM {{ ref('stg_historical_prices') }}

),

latest_countries AS (

    SELECT DISTINCT country
    FROM {{ ref('stg_historical_prices') }}
    WHERE observed_date = (SELECT observed_date FROM latest_date)

)

SELECT m.country

FROM {{ ref('country_codes') }} AS m

WHERE m.country NOT IN (

    SELECT country
    FROM latest_countries

)