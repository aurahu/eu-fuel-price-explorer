import { NextResponse } from "next/server";

import {
  getLastMonthPrices,
  getLastYearPrices,
  getLast5YearsPrices,
  getLast10YearsPrices,
  getLast25YearsPrices,
} from "@/lib/queries/historical-prices";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const country =
    searchParams.get("country") ?? "FI";

  const fuel =
    searchParams.get("fuel") ?? "petrol_95";

  const view =
    searchParams.get("view") ?? "last-month";

  try {
    let prices;

    if (view === "last-month") {
      prices = await getLastMonthPrices(
        country,
        fuel
      );
    } else if (view === "last-year") {
      prices = await getLastYearPrices(
        country,
        fuel
      );
    } else if (view === "last-5-years") {
    prices = await getLast5YearsPrices(
      country,
      fuel
    );
    } else if (view === "last-10-years") {
      prices = await getLast10YearsPrices(
        country,
        fuel
      );
    } else if (view === "last-25-years") {
      prices = await getLast25YearsPrices(
        country,
        fuel
      );
    } else {
      return NextResponse.json(
        { error: "Invalid view" },
        { status: 400 }
      );
    }

    return NextResponse.json(prices);
  } catch (error) {
    console.error(
      "Failed to fetch historical prices:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch historical prices",
      },
      { status: 500 }
    );
  }
}