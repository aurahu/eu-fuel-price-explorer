"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import Pill from "./Pill";

type FuelPrice = {
  country: string;
  country_code: string;
  fuel_type: string;
  price_eur_per_litre: string | number;
  observed_date: string;
};

type Props = {
  prices: FuelPrice[];
};

const views = [
  {
    value: "last-month",
    label: "Last month",
  },
  {
    value: "last-year",
    label: "Last year",
  },
  {
    value: "last-10-years",
    label: "Last 10 years",
  },
  {
    value: "last-25-years",
    label: "Last 25 years",
  },
];

export function HistoricalFuelChart({
  prices,
}: Props) {
  const [selectedCountry, setSelectedCountry] =
    useState("FI");

  const [selectedFuel, setSelectedFuel] =
    useState("petrol_95");

  const [selectedView, setSelectedView] =
    useState("last-month");

  const [historicalPrices, setHistoricalPrices] =
    useState<FuelPrice[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

    const views = [
    {
      value: "last-month",
      label: "Last month",
    },
    {
      value: "last-year",
      label: "Last year",
    },
    {
      value: "last-10-years",
      label: "Last 10 years",
    },
    {
      value: "last-25-years",
      label: "Last 25 years",
    },
  ];

  /*
   * Get countries from the same data source
   * used by CountryComparison.
   */
  const countries = useMemo(() => {
    const unique = new Map<
      string,
      {
        code: string;
        name: string;
      }
    >();

    prices.forEach((row) => {
      unique.set(row.country_code, {
        code: row.country_code,
        name: row.country,
      });
    });

    return [...unique.values()].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [prices]);

  /*
   * Fetch historical data whenever the
   * country, fuel or view changes.
   */
  useEffect(() => {
    async function fetchHistoricalPrices() {
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          country: selectedCountry,
          fuel: selectedFuel,
          view: selectedView,
        });

        const response = await fetch(
          `/api/historical-prices?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch historical prices"
          );
        }

        const data = await response.json();

        setHistoricalPrices(data);
      } catch (error) {
        console.error(error);
        setHistoricalPrices([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoricalPrices();
  }, [
    selectedCountry,
    selectedFuel,
    selectedView,
  ]);

  /*
   * Convert database rows into chart data.
   */
  const chartData = useMemo(() => {
  return historicalPrices.map((row) => {
    const date = new Date(row.observed_date);

    return {
      date: row.observed_date,
      timestamp: date.getTime(),
      year: date.getFullYear(),
      month: date.getMonth(),
      price: Number(row.price_eur_per_litre),
    };
  });
}, [historicalPrices]);



  const chartConfig = {
    price: {
      label: "Price",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="space-y-6 w-full">
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Country */}
        <Select
          value={selectedCountry}
          onValueChange={(value) => {
            if (value) {
              setSelectedCountry(value);
            }
          }}
        >
          <SelectTrigger className="w-full lg:w-55">
            <SelectValue placeholder="Select country">
              {countries.find(
                (country) => country.code === selectedCountry
              )?.name}
            </SelectValue>
          </SelectTrigger>

          <SelectContent>
            {countries.map((country) => (
              <SelectItem
                key={country.code}
                value={country.code}
              >
                <span className="mr-2 text-base text-gray">
                  {country.code}
                </span>

                <span className="text-lg text-black">
                  {country.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fuel + View */}
        <div className="flex flex-row justify-center items-center gap-3 sm:flex-row">
          {/* Fuel toggle */}
          <div className="flex rounded-sm h-12 shrink-0 border border-light-gray p-1">
            <button
              type="button"
              onClick={() =>
                setSelectedFuel("petrol_95")
              }
              className={`rounded-[4px] px-4 text-center cursor-pointer py-2 text-base transition ${
                selectedFuel === "petrol_95"
                  ? "bg-black text-background"
                  : "text-muted-foreground"
              }`}
            >
              Petrol 95
            </button>

            <button
              type="button"
              onClick={() =>
                setSelectedFuel("diesel")
              }
              className={`rounded-[4px] px-4 py-2 text-base cursor-pointer transition ${
                selectedFuel === "diesel"
                  ? "bg-black text-background"
                  : "text-muted-foreground"
              }`}
            >
              Diesel
            </button>
          </div>

          {/* View */}
          <Select
            value={selectedView}
            onValueChange={(value) => {
              if (value) {
                setSelectedView(value);
              }
            }}
          >
            <SelectTrigger className="w-full text-base! sm:w-42.5]">
              <SelectValue>
                {views.find(
                  (view) => view.value === selectedView
                )?.label}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {views.map((view) => (
                <SelectItem
                  key={view.value}
                  value={view.value}
                >
                  {view.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex md:justify-end pt-6">
        <Pill className="text-muted-foreground text-sm!" variant="ghost">EUR / L</Pill>
      </div>

      {/* Chart */}
      <div>
        {isLoading ? (
          <div className="flex h-87.5 items-center justify-center text-2xl font-serif text-black">
            Loading historical prices...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-87.5 items-center justify-center text-2xl font-serif text-black">
            No historical data available.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-87.5 w-full focus-visible:border-none focus-visible:outline-none active:border-none"
          >
            <AreaChart
              data={chartData}
              margin={{
                left: 0,
                right: 12,
                top: 10,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="fillPrice"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-accent-yellow-bright)"
                    stopOpacity={0.9}
                  />

                  <stop
                    offset="95%"
                    stopColor="var(--color-accent-yellow-bright)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
              />

              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                domain={["dataMin", "dataMax"]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);

                  if (
                    selectedView === "last-10-years" ||
                    selectedView === "last-25-years"
                  ) {
                    return date.getFullYear().toString();
                  }

                  if (selectedView === "last-year") {
                    return date.toLocaleDateString(
                      "en-GB",
                      {
                        month: "short",
                      }
                    );
                  }

                  return date.toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  );
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  `${Number(value).toFixed(2)}`
                }
                width={45}
              />

              <ChartTooltip
                cursor={{
                  stroke: "var(--color-black/25)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                offset={12}
                content={
                  <ChartTooltipContent
                    className="rounded-sm border border-light-gray font-sans bg-background shadow-none"
                    labelFormatter={(
                      _,
                      payload
                    ) => {
                      const item =
                        payload?.[0]?.payload;

                      if (!item) {
                        return "";
                      }

                      const date = new Date(
                        item.date
                      );

                      return date.toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      );
                    }}
                    formatter={(value) => [
                      `${Number(value).toFixed(3)} €/L`,
                    ]}
                  />
                }
              />

              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke="var(--color-black)"
                strokeWidth={1}
                dot={{
                  r: 0,
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 5,
                  fill: "var(--background)",
                  stroke: "var(--color-black)",
                  strokeWidth: 1,
                }}
                className="touch-none"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}