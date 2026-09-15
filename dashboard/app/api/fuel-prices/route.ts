import { NextResponse } from "next/server";
import { getFuelPrices } from "@/lib/queries/fuel-prices";

export async function GET() {
  try {
    const prices = await getFuelPrices();

    return NextResponse.json(prices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch fuel prices" },
      { status: 500 }
    );
  }
}