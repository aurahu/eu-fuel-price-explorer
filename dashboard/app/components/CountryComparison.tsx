"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CaretDown,
  X,
  SortAscending,
  SortDescending,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import Pill from "./Pill";

type FuelPrice = {
  country: string;
  country_code: string;
  fuel_type: string;
  price_eur_per_litre: string | number;
  observed_date: string | Date;
};

type Props = {
  prices: FuelPrice[];
};

export default function CountryComparison({ prices }: Props) {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [petrolSort, setPetrolSort] = useState<"asc" | "desc">("asc");
  const [dieselSort, setDieselSort] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Unique countries
  const countries = useMemo(() => {
    const unique = new Map();

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

  // Countries shown in dropdown
  // Selected countries are removed from the list.
  const filteredCountries = useMemo(() => {
    return countries.filter((country) => {
      const isSelected = selectedCountries.includes(country.code);

      const matchesSearch = country.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return !isSelected && matchesSearch;
    });
  }, [countries, selectedCountries, searchQuery]);

  // Add / remove country
  function toggleCountry(code: string) {
    setSelectedCountries((current) => {
      if (current.includes(code)) {
        return current.filter((item) => item !== code);
      }

      if (current.length >= 3) {
        return current;
      }

      const updated = [...current, code];

      // Close dropdown when 3 countries are selected
      if (updated.length === 3) {
        setDropdownOpen(false);
        setSearchQuery("");
      }

      return updated;
    });
  }

  // Selected data
  const selectedData = useMemo(() => {
    return prices.filter((row) =>
      selectedCountries.includes(row.country_code)
    );
  }, [prices, selectedCountries]);

  // Petrol
  const petrol = useMemo(() => {
    const filtered = selectedData.filter(
      (row) => row.fuel_type === "petrol_95"
    );

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.price_eur_per_litre);
      const priceB = Number(b.price_eur_per_litre);

      return petrolSort === "asc"
        ? priceA - priceB
        : priceB - priceA;
    });
  }, [selectedData, petrolSort]);

  // Diesel
  const diesel = useMemo(() => {
    const filtered = selectedData.filter(
      (row) => row.fuel_type === "diesel"
    );

    return [...filtered].sort((a, b) => {
      const priceA = Number(a.price_eur_per_litre);
      const priceB = Number(b.price_eur_per_litre);

      return dieselSort === "asc"
        ? priceA - priceB
        : priceB - priceA;
    });
  }, [selectedData, dieselSort]);

  return (
    <div className="w-full">

      <div className="flex flex-col justify-center px-4 gap-16 py-30 bg-accent-yellow">

        {/* LEFT — INTRO + COUNTRY SELECTOR */}
        <div className="w-full flex flex-col items-center justify-center">

          <h2 className="mb-4 font-serif text-7xl font-medium text-black text-center md:text-left">
            Compare countries
          </h2>

          <p className="mb-8 text-center text-lg font-medium text-gray-500 md:text-left">
            Compare last week’s fuel prices across countries.
          </p>

          {/* Selected country pills */}
          <div className="mb-3 flex flex-wrap justify-center gap-3 md:justify-start">
            {selectedCountries.map((code) => {
              const country = countries.find(
                (c) => c.code === code
              );

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggleCountry(code)}
                  className="flex cursor-pointer items-center gap-2 rounded-sm bg-black px-3 py-2 font-sans text-lg font-medium text-background"
                >
                  <span className="text-base opacity-60">
                    {country?.code}
                  </span>

                  {country?.name}

                  <X size={20} />
                </button>
              );
            })}
          </div>

          {/* DROPDOWN */}
          <div
            ref={dropdownRef}
            className="relative w-full mt-9 md:max-w-sm"
          >

            {/* Dropdown opener / search */}
            {dropdownOpen ? (
              <div
                className="flex w-full items-center gap-2 rounded-sm bg-background border border-light-gray px-4 py-3"
              >
                <MagnifyingGlass
                  size={20}
                  className="shrink-0 text-gray"
                />

                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search countries..."
                  className="w-full text-base outline-none md:text-lg"
                />
              </div>
            ) : (
              <button
                type="button"
                disabled={selectedCountries.length >= 3}
                onClick={() => {
                  setDropdownOpen(true);
                  setSearchQuery("");
                }}
                className={`flex w-full items-center gap-2 rounded-sm border border-light-gray px-4 py-3 text-left ${
                  selectedCountries.length >= 3
                    ? "cursor-not-allowed bg-black/5 opacity-50"
                    : "cursor-pointer bg-background"
                }`}
              >
                <MagnifyingGlass
                  size={20}
                  className="shrink-0 text-gray"
                />

                <span className="flex-1 text-base md:text-lg">
                  {selectedCountries.length >= 3 ? (
                    <span className="text-gray-950">
                      Remove one country to continue
                    </span>
                  ) : (
                    "Select up to 3 countries"
                  )}
                </span>

                <CaretDown
                  size={20}
                  color="var(--color-gray)"
                  className="shrink-0"
                />
              </button>
            )}

            {/* Dropdown list */}
            {dropdownOpen && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-sm border border-light-gray bg-background">

                <div className="max-h-64 overflow-y-auto">

                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => {
                      const disabled =
                        selectedCountries.length >= 3;

                      return (
                        <button
                          key={country.code}
                          type="button"
                          disabled={disabled}
                          onClick={() =>
                            toggleCountry(country.code)
                          }
                          className={`block w-full px-4 py-3 text-left ${
                            disabled
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <span className="mr-2 text-base text-gray">
                            {country.code}
                          </span>

                          <span className="text-lg text-black">
                            {country.name}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="px-4 py-4 text-sm text-gray-500">
                      No countries found.
                    </p>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT — STATS */}
        <div className="w-full md:flex md:gap-20 md:min-w-4xl">

            <div className="w-full">
                {/* PETROL */}
                <FuelSection
                    title="Petrol 95"
                    prices={petrol}
                    sort={petrolSort}
                    onSort={() =>
                    setPetrolSort((current) =>
                        current === "asc" ? "desc" : "asc"
                    )
                    }
                />
            </div>
          

            {/* DIESEL */}
            <div className="mt-14 md:mt-0 md:border-none md:pt-0 w-full border-t border-gray-on-yellow/50 pt-14">
                <FuelSection
                title="Diesel"
                prices={diesel}
                sort={dieselSort}
                onSort={() =>
                    setDieselSort((current) =>
                    current === "asc" ? "desc" : "asc"
                    )
                }
                />
            </div>
        </div>

      </div>
    </div>
  );
}

type FuelSectionProps = {
  title: string;
  prices: FuelPrice[];
  sort: "asc" | "desc";
  onSort: () => void;
};

function FuelSection({
  title,
  prices,
  sort,
  onSort,
}: FuelSectionProps) {

  const cheapestPrice =
  prices.length > 0
    ? Math.min(
        ...prices.map((p) => Number(p.price_eur_per_litre))
      )
    : 0;

  return (
    <section className="space-y-5">

      <div className="flex items-center justify-between">

        <Pill variant="outline">{title}</Pill>

        <button
          type="button"
          onClick={onSort}
          className="flex items-center gap-2"
        >
          {sort === "asc" ? (
            <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-gray-on-yellow/50">
              <SortAscending
                size={20}
                color="var(--color-black)"
              />
            </div>

          ) : (
            <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-gray-on-yellow/50">
              <SortDescending size={20} />
            </div>
          )}
        </button>

      </div>

      <div className="flex w-full justify-end">
        <Pill
          className="text-gray-on-yellow"
          variant="ghost"
        >
          EUR / L
        </Pill>
      </div>

      <div className="space-y-10">

        {prices.map((price) => {
          const numericPrice = Number(
            price.price_eur_per_litre
          );

          const difference =
            numericPrice - cheapestPrice;

          const percentageDifference =
            cheapestPrice > 0
              ? (difference / cheapestPrice) * 100
              : 0;

          const isCheapest =
            numericPrice === cheapestPrice;

          return (
            <div
              key={
                price.country_code +
                price.fuel_type
              }
              className="flex items-start justify-between px-0"
            >

                {/* Country */}
                <span className="font-serif text-4xl">
                {price.country}
                </span>

                <div className="flex flex-col justify-end gap-5">
                    {/* Price */}
                    <span className="text-right font-digital text-4xl">
                    {numericPrice.toFixed(3)}
                    </span>

                    {/* Difference */}
                    <div className="text-base text-right text-gray-on-yellow">
                        {isCheapest ? (
                        <span className="text-green-800">Cheapest</span>
                        ) : (
                        <span className="text-red-800">
                            +€{difference.toFixed(3)} / +
                            {percentageDifference.toFixed(1)}%
                        </span>
                        )}
                    </div>
                </div>

              

            </div>
          );
        })}

      </div>
    </section>
  );
}