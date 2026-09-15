import pool from "@/lib/db";

export async function getFuelPrices() {
  const result = await pool.query(`
    SELECT *
    FROM analytics.fact_fuel_prices
    ORDER BY country, fuel_type;
  `);

  return result.rows;
}


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
    ORDER BY fuel_type, price_eur_per_litre;
  `);

  return result.rows;
}