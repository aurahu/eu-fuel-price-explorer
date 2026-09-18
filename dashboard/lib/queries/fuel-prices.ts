import pool from "@/lib/db";


export async function getLatestFuelPrices() {
  const result = await pool.query(`
    SELECT
      country,
      country_code,
      fuel_type,
      observed_date,
      price_eur_per_litre
    FROM analytics.fact_fuel_prices
    WHERE observed_date = (
      SELECT MAX(observed_date)
      FROM analytics.fact_fuel_prices
    )
  `);

  return result.rows;
}

export async function getCheapestPetrol() {
  const result = await pool.query(`
    SELECT
      country,
      price_eur_per_litre,
      observed_date
      FROM analytics.fact_fuel_prices
      WHERE fuel_type = 'petrol_95'
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_fuel_prices
        )
      ORDER BY price_eur_per_litre ASC
      LIMIT 1;
    `);

  return result.rows[0];

};

export async function getPriciestPetrol() {
  const result = await pool.query(`
    SELECT
      country,
      price_eur_per_litre,
      observed_date
      FROM analytics.fact_fuel_prices
      WHERE fuel_type = 'petrol_95'
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_fuel_prices
        )
      ORDER BY price_eur_per_litre DESC
      LIMIT 1;
    `);

  return result.rows[0];

};

export async function getCheapestDiesel() {
  const result = await pool.query(`
    SELECT
      country,
      price_eur_per_litre,
      observed_date
      FROM analytics.fact_fuel_prices
      WHERE fuel_type = 'diesel'
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_fuel_prices
        )
      ORDER BY price_eur_per_litre ASC
      LIMIT 1;
    `);

  return result.rows[0];

};

export async function getPriciestDiesel() {
  const result = await pool.query(`
    SELECT
      country,
      price_eur_per_litre,
      observed_date
      FROM analytics.fact_fuel_prices
      WHERE fuel_type = 'diesel'
        AND observed_date = (
          SELECT MAX(observed_date)
          FROM analytics.fact_fuel_prices
        )
      ORDER BY price_eur_per_litre DESC
      LIMIT 1;
    `);

  return result.rows[0];

};


export async function getLatestObservedDate() {
  const result = await pool.query(`
    SELECT MAX(observed_date) AS latest_date
    FROM analytics.fact_fuel_prices;
  `);

  return result.rows[0].latest_date;
}