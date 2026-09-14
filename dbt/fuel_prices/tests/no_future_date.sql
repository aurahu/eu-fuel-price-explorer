SELECT *
FROM {{ ref('stg_weekly_prices') }}
WHERE observed_date > CURRENT_DATE