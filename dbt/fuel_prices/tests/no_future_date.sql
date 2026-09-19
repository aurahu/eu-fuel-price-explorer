SELECT observed_date
FROM {{ ref('stg_weekly_prices') }}
WHERE observed_date > CURRENT_DATE

UNION ALL

SELECT observed_date
FROM {{ ref('stg_historical_prices') }}
WHERE observed_date > CURRENT_DATE