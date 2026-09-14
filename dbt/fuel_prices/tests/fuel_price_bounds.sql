SELECT *
FROM {{ ref('stg_weekly_prices') }}
WHERE
    price_eur_per_litre <= 0
OR price_eur_per_litre > 10