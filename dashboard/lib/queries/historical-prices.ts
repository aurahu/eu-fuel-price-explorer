import pool from "@/lib/db";

export async function getLastMonthPrices(
  countryCode: string,
  fuelType: string
) {
  const result = await pool.query(
    `
      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM analytics.fact_historical_fuel_prices
      WHERE country_code = $1
        AND fuel_type = $2
        AND observed_date >= CURRENT_DATE - INTERVAL '1 month'
      ORDER BY observed_date
    `,
    [countryCode, fuelType]
  );

  return result.rows;
}

export async function getLastYearPrices(
  countryCode: string,
  fuelType: string
) {
  const result = await pool.query(
    `
      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM (
        SELECT
          country,
          country_code,
          fuel_type,
          price_eur_per_litre,
          observed_date,

          ROW_NUMBER() OVER (
            PARTITION BY
              DATE_TRUNC('month', observed_date)
            ORDER BY observed_date DESC
          ) AS row_number

        FROM analytics.fact_historical_fuel_prices

        WHERE country_code = $1
          AND fuel_type = $2
          AND observed_date >= CURRENT_DATE - INTERVAL '1 year'
      ) AS monthly

      WHERE row_number = 1

      ORDER BY observed_date
    `,
    [countryCode, fuelType]
  );

  return result.rows;
}

export async function getLast5YearsPrices(
  countryCode: string,
  fuelType: string
) {
  const result = await pool.query(
    `
      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM (
        SELECT
          country,
          country_code,
          fuel_type,
          price_eur_per_litre,
          observed_date,

          ROW_NUMBER() OVER (
            PARTITION BY
              EXTRACT(YEAR FROM observed_date),
              EXTRACT(MONTH FROM observed_date)
            ORDER BY observed_date DESC
          ) AS row_number

        FROM analytics.fact_historical_fuel_prices

        WHERE country_code = $1
          AND fuel_type = $2
          AND observed_date >= CURRENT_DATE - INTERVAL '5 years'
      ) AS monthly

      WHERE row_number = 1

      UNION ALL

      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM analytics.fact_historical_fuel_prices
      WHERE country_code = $1
        AND fuel_type = $2
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_historical_fuel_prices
          WHERE country_code = $1
            AND fuel_type = $2
        )

      ORDER BY observed_date
    `,
    [countryCode, fuelType]
  );

  return result.rows;
}


export async function getLast10YearsPrices(
  countryCode: string,
  fuelType: string
) {
  const result = await pool.query(
    `
      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM (
        SELECT
          country,
          country_code,
          fuel_type,
          price_eur_per_litre,
          observed_date,

          ROW_NUMBER() OVER (
            PARTITION BY
              EXTRACT(YEAR FROM observed_date),
              EXTRACT(MONTH FROM observed_date)
            ORDER BY observed_date DESC
          ) AS row_number

        FROM analytics.fact_historical_fuel_prices

        WHERE country_code = $1
          AND fuel_type = $2
          AND observed_date >= CURRENT_DATE - INTERVAL '10 years'
      ) AS monthly

      WHERE row_number = 1

      UNION ALL

      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM analytics.fact_historical_fuel_prices
      WHERE country_code = $1
        AND fuel_type = $2
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_historical_fuel_prices
          WHERE country_code = $1
            AND fuel_type = $2
        )

      ORDER BY observed_date
    `,
    [countryCode, fuelType]
  );

  return result.rows;
}


export async function getLast25YearsPrices(
  countryCode: string,
  fuelType: string
) {
  const result = await pool.query(
    `
      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM (
        SELECT
          country,
          country_code,
          fuel_type,
          price_eur_per_litre,
          observed_date,

          ROW_NUMBER() OVER (
            PARTITION BY
              EXTRACT(YEAR FROM observed_date),
              EXTRACT(MONTH FROM observed_date)
            ORDER BY observed_date DESC
          ) AS row_number

        FROM analytics.fact_historical_fuel_prices

        WHERE country_code = $1
          AND fuel_type = $2
          AND observed_date >= CURRENT_DATE - INTERVAL '25 years'
      ) AS monthly

      WHERE row_number = 1

      UNION ALL

      SELECT
        country,
        country_code,
        fuel_type,
        price_eur_per_litre,
        observed_date
      FROM analytics.fact_historical_fuel_prices
      WHERE country_code = $1
        AND fuel_type = $2
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_historical_fuel_prices
          WHERE country_code = $1
            AND fuel_type = $2
        )

      ORDER BY observed_date
    `,
    [countryCode, fuelType]
  );

  return result.rows;
}