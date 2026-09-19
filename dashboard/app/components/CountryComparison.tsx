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

      setSearchQuery("");

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
    <div className="w-full bg-accent-yellow">

      <div className="flex flex-col md:flex-row md:items-start justify-center items-center px-4 md:px-12 md:gap-12 gap-6 py-30">

        {/* INTRO + COUNTRY SELECTOR */}
        <div className="w-full md:w-xl flex flex-col md:justify-start md:items-start items-center justify-center">

          <h2 className="mb-8 font-serif text-7xl md:text-8xl font-medium text-black text-center md:text-left">
            Compare countries
          </h2>

          <p className="mb-12 text-center text-lg md:text-xl font-medium text-black/50 md:text-left">
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
        

        {/* STATS */}

        {/* DESKTOP RIGHT SIDE */}
        <div className="hidden md:block w-full md:max-w-3xl">
          {selectedCountries.length > 0 ? (

            /* DESKTOP STATS */
            <div className="bg-background p-9 rounded-sm border border-light-gray">
              <section className="space-y-7">

                <div className="flex items-center justify-between mb-12">
                  <Pill variant="outline">
                    Fuel prices (EUR / L)
                  </Pill>

                  <button
                    type="button"
                    onClick={() =>
                      setPetrolSort((current) =>
                        current === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    {petrolSort === "asc" ? (
                      <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-light-gray">
                        <SortAscending
                          size={20}
                          color="var(--color-black)"
                        />
                      </div>
                    ) : (
                      <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-light-gray">
                        <SortDescending size={20} />
                      </div>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-8 gap-y-12">

                  {/* HEADERS */}

                  <div>
                    <Pill
                      variant="ghost"
                      className="text-gray-on-yellow"
                    >
                      Country
                    </Pill>
                  </div>

                  <div className="text-right">
                    <Pill
                      variant="ghost"
                      className="text-gray-on-yellow"
                    >
                      Petrol 95
                    </Pill>
                  </div>

                  <div className="text-right">
                    <Pill
                      variant="ghost"
                      className="text-gray-on-yellow"
                    >
                      Diesel
                    </Pill>
                  </div>

                  {/* COUNTRIES */}

                  {(() => {
                    const cheapestPetrol = Math.min(
                      ...petrol.map((price) =>
                        Number(price.price_eur_per_litre)
                      )
                    );

                    const cheapestDiesel =
                      diesel.length > 0
                        ? Math.min(
                            ...diesel.map((price) =>
                              Number(price.price_eur_per_litre)
                            )
                          )
                        : 0;

                    return petrol.map((petrolPrice) => {
                      const dieselPrice = diesel.find(
                        (price) =>
                          price.country_code ===
                          petrolPrice.country_code
                      );

                      const petrolValue = Number(
                        petrolPrice.price_eur_per_litre
                      );

                      const dieselValue = dieselPrice
                        ? Number(
                            dieselPrice.price_eur_per_litre
                          )
                        : null;

                      const petrolDifference =
                        petrolValue - cheapestPetrol;

                      const dieselDifference =
                        dieselValue !== null
                          ? dieselValue - cheapestDiesel
                          : 0;

                      const petrolPercentage =
                        cheapestPetrol > 0
                          ? (petrolDifference / cheapestPetrol) * 100
                          : 0;

                      const dieselPercentage =
                        cheapestDiesel > 0 &&
                        dieselValue !== null
                          ? (dieselDifference / cheapestDiesel) * 100
                          : 0;

                      const petrolIsCheapest =
                        petrolValue === cheapestPetrol;

                      const dieselIsCheapest =
                        dieselValue !== null &&
                        dieselValue === cheapestDiesel;

                      return (
                        <div
                          key={petrolPrice.country_code}
                          className="contents"
                        >

                          {/* COUNTRY */}

                          <span className="font-serif text-4xl">
                            {petrolPrice.country}
                          </span>

                          {/* PETROL */}

                          <div className="flex flex-col items-end gap-4">

                            <span className="text-right font-digital text-4xl">
                              {petrolValue.toFixed(3)}
                            </span>

                            <div className="text-base text-right text-gray-on-yellow">
                              {petrolIsCheapest ? (
                                <span className="text-green-700">
                                  Cheapest
                                </span>
                              ) : (
                                <span className="text-red-700 tracking-wide">
                                  +€{petrolDifference.toFixed(3)} / +
                                  {petrolPercentage.toFixed(1)}%
                                </span>
                              )}
                            </div>

                          </div>

                          {/* DIESEL */}

                          <div className="flex flex-col items-end gap-4">

                            {dieselValue !== null ? (
                              <>
                                <span className="text-right font-digital text-4xl">
                                  {dieselValue.toFixed(3)}
                                </span>

                                <div className="text-base text-right text-gray-on-yellow">
                                  {dieselIsCheapest ? (
                                    <span className="text-green-700">
                                      Cheapest
                                    </span>
                                  ) : (
                                    <span className="text-red-700 tracking-wide">
                                      +€{dieselDifference.toFixed(3)} / +
                                      {dieselPercentage.toFixed(1)}%
                                    </span>
                                  )}
                                </div>
                              </>
                            ) : (
                              <span className="text-right font-digital text-3xl">
                                —
                              </span>
                            )}

                          </div>

                        </div>
                      );
                    });
                  })()}

                </div>
              </section>
            </div>

          ) : (

            /* DESKTOP EMPTY STATE */

            <div className="relative flex min-h-120 w-full items-center justify-center overflow-hidden rounded-sm p-9">
              {/* Background image */}
              <img
                src="/compare-countries-img.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-background/20" />

              
            </div>
          )}
        </div>


        {/* MOBILE STATS */}

        {selectedCountries.length > 0 && (
          <div className="w-full md:hidden">

            {/* PETROL */}
            <div className="w-full bg-background p-6 rounded-t-sm border-light-gray border border-b-0">
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
            <div className="w-full bg-background p-6 rounded-b-sm border-light-gray border">
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
        )}

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
    <section className="space-y-7">

      <div className="flex items-center justify-between">

        <Pill variant="outline">{title}</Pill>

        <button
          type="button"
          onClick={onSort}
          className="flex items-center gap-2"
        >
          {sort === "asc" ? (
            <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-light-gray">
              <SortAscending
                size={20}
                color="var(--color-black)"
              />
            </div>

          ) : (
            <div className="flex size-11 rounded-full cursor-pointer bg-black/5 items-center justify-center border border-light-gray">
              <SortDescending size={20} />
            </div>
          )}
        </button>

      </div>

      <div className="flex w-full justify-end">
        <Pill
          className="text-gray font-medium!"
          variant="ghost"
        >
          EUR / L
        </Pill>
      </div>

      <div className="space-y-16">

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
                        <span className="text-green-700">Cheapest</span>
                        ) : (
                        <span className="text-red-700 tracking-wide">
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