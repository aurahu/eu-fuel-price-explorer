import { getCheapestDiesel, getCheapestPetrol, getLatestFuelPrices, getLatestObservedDate, getPriciestDiesel, getPriciestPetrol } from "@/lib/queries/fuel-prices";
import Image from "next/image";
import Link from "next/link";
import TextureCard from "./components/TextureCard";
import Pill from "./components/Pill";
import TabPanel from "./components/TabPanel";
import CountryComparison from "./components/CountryComparison";
import { HistoricalFuelChart } from "./components/HistoricalFuelChart";
import { SealCheckIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";

export default async function Home() {
  const latestDate = await getLatestObservedDate();
  const cheapestPetrol = await getCheapestPetrol();
  const cheapestDiesel = await getCheapestDiesel();
  const priciestPetrol = await getPriciestPetrol();
  const priciestDiesel = await getPriciestDiesel();
  const fuelPrices = await getLatestFuelPrices();



  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className="flex flex-col flex-1 w-full">
        

        {/* HERO */}
        <div id="home" className="flex flex-col md:h-dvh lg:flex-row w-full bg-accent-yellow justify-center items-center md:border-b md:border-black">

          <div className="flex flex-col w-full lg:w-1/2 items-center justify-center lg:items-start gap-12 px-4 py-20 md:px-12 border-y border-black md:border-none">
            <div className="flex flex-row gap-2 md:gap-4 bg-black px-6 py-2 items-center justify-center">
              <div className="w-2 h-2 bg-success blur-[2px] rounded-full" />
              <p className="text-background font-semibold uppercase tracking-wider text-sm">
                Observed on {" "}
                {latestDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-left font-serif text-black text-center">
              Fuel prices across the <span className="italic">European Union</span>, updated weekly.
            </h1>
          </div>

          
          <div className="relative h-[600px] md:h-full w-full lg:w-1/2 overflow-hidden">
            <Image
              src="/hero-image-full.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            <div className="bg-animation" />
          </div>
        </div>

        {/* Cheapest price section */}
        <div id="cheapest-fuel-last-week" className="w-full flex flex-col items-center justify-center">
          <div className="flex w-full border-b border-black justify-between px-4 items-center md:border-none py-4">
            <p className="uppercase text-base md:text-xl font-medium text-gray">
              Week of</p>
            <p className="uppercase text-base md:text-xl font-semibold text-black">
              {latestDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row w-full pt-25 pb-4 md:px-8 lg:px-0 md:py-25 gap-12 lg:max-w-7xl items-center justify-center">
            <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl text-center lg:text-left px-4">
              The <span className="italic">cheapest</span> fuel in the past week.
            </h2>

            <div className="flex flex-col w-full md:flex-row md:min-w-2/3 gap-4 px-4">
              {/* Cheapest petrol card */}
              <TextureCard className="w-full flex " overlayColor="#F6FF99" overlayOpacity={0.9}>

                <div className="w-full flex justify-between items-center">
                  <Pill>Petrol 95</Pill>
                  <Pill className="text-gray-on-yellow" variant="ghost">EUR / L</Pill>
                </div>

                {/* Petrol price and country */}
                <div className="w-full flex flex-col gap-9 justify-center h-auto items-center pb-2">
                  <p className="text-black font-digital text-7xl h-18 -ml-8">{Number(cheapestPetrol.price_eur_per_litre).toFixed(3)}</p>
                  <p className="font-serif text-center text-4xl">{cheapestPetrol.country}</p>
                </div>

                {/* Observed on */}
                <div className="w-full flex justify-between items-center">
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                    {(cheapestPetrol.observed_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Pill>
                </div>

              </TextureCard>

              {/* Cheapest diesel card */}
              <TextureCard className="w-full flex " overlayColor="#E1DBFF" overlayOpacity={0.9}>

                <div className="w-full flex justify-between items-center">
                  <Pill>Diesel</Pill>
                  <Pill className="text-gray-on-yellow" variant="ghost">EUR / L</Pill>
                </div>

                {/* Petrol price and country */}
                <div className="w-full flex flex-col gap-8 justify-center h-auto items-center pb-2">
                  <p className="text-black font-digital text-7xl h-18 -ml-8">{Number(cheapestDiesel.price_eur_per_litre).toFixed(3)}</p>
                  <p className="font-serif text-center text-4xl">{cheapestDiesel.country}</p>
                </div>

                {/* Observed on */}
                <div className="w-full flex justify-between items-center">
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                    {(cheapestDiesel.observed_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Pill>
                </div>
              </TextureCard>
            </div>
          </div>
        </div>

        {/* Most expensive Section */}
        <div id="priciest-fuel-last-week" className="w-full flex flex-col justify-center items-center">
          <div className="relative w-full overflow-hidden md:min-h-200 md:py-6">
            {/* BG image */}
            <Image
              src={"/texture-2.1.jpg"}
              alt=""
              fill
              className="object-cover pointer-events-none"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/85 z-10" />

            {/* Content */}
            <div className=" w-full flex flex-col justify-center gap-20 pt-30 md:py-30 md:px-8 lg:px-0 items-center relative z-20">
              <h2 className="font-serif text-[56px] leading-[100%] md:text-7xl lg:text-8xl md:max-w-4xl text-center text-background px-4">
                The <span className="italic">highest</span> fuel prices were found in {priciestPetrol.country} and {priciestDiesel.country}.
              </h2>

              {/* Most expensive (mobile) */}
              <div className="relative md:hidden z-30 w-full border-b border-black">
                <TabPanel  tabs={[
                  {
                    label: "Petrol (95)",
                    color: "#FFF8E8",
                    content:
                    <div className="flex flex-col w-full px-4 pt-30 pb-4 gap-9">
                      <p className="font-serif text-center text-4xl">
                      € {""}
                        <span className="font-digital text-7xl h-18">{Number(priciestPetrol.price_eur_per_litre).toFixed(3)}</span>
                       {""} /L
                      </p>
                      <p className="font-serif mb-6 text-center text-4xl">
                        in{""} {priciestPetrol.country}
                      </p>

                      {/* Observed on */}
                      <div className="w-full flex justify-between items-center mt-12">
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                          {(priciestPetrol.observed_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Pill>
                      </div>
                    </div>,
                  },
                  {
                    label: "Diesel",
                    color: "#FFF8E8",
                    content:
                    <div className="flex flex-col w-full px-4 pt-30 pb-4 gap-9">
                      <p className="font-serif text-center text-4xl">
                      € {""}
                        <span className="font-digital text-7xl h-18">{Number(priciestDiesel.price_eur_per_litre).toFixed(3)}</span>
                       {""} /L
                      </p>
                      <p className="font-serif mb-6 text-center text-4xl">
                        in{""} {priciestDiesel.country}
                      </p>

                      {/* Observed on */}
                      <div className="w-full flex justify-between items-center mt-12">
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                          {(priciestDiesel.observed_date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Pill>
                      </div>
                    </div>,
                  },
      
                ]} />

              </div>

              {/* Most expensive (desktop) */}
              <div className="hidden md:flex w-full md:max-w-4xl gap-4 px-4">

                {/* Most expensive petrol card */}
                <TextureCard className="w-full flex " overlayColor="#FFE8FD" overlayOpacity={0.9}>

                  <div className="w-full flex justify-between items-center">
                    <Pill>Petrol 95</Pill>
                    <Pill className="text-gray-on-yellow" variant="ghost">EUR / L</Pill>
                  </div>

                  {/* Petrol price and country */}
                  <div className="w-full flex flex-col gap-9 justify-center h-auto items-center pb-2">
                    <p className="text-black font-digital text-7xl h-18">{Number(priciestPetrol.price_eur_per_litre).toFixed(3)}</p>
                    <p className="font-serif text-center text-4xl">{priciestPetrol.country}</p>
                  </div>

                  {/* Observed on */}
                  <div className="w-full flex justify-between items-center">
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                      {(priciestPetrol.observed_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Pill>
                  </div>
                </TextureCard>

                {/* Most expensive diesel card */}
                <TextureCard className="w-full flex " overlayColor="#D9D9D9" overlayOpacity={0.9}>

                  <div className="w-full flex justify-between items-center">
                    <Pill>Diesel</Pill>
                    <Pill className="text-gray-on-yellow" variant="ghost">EUR / L</Pill>
                  </div>

                  {/* Diesel price and country */}
                  <div className="w-full flex flex-col gap-9 justify-center h-auto items-center pb-2">
                    <p className="text-black font-digital text-7xl h-18">{Number(priciestDiesel.price_eur_per_litre).toFixed(3)}</p>
                    <p className="font-serif text-center text-4xl">{priciestDiesel.country}</p>
                  </div>

                  {/* Observed on */}
                  <div className="w-full flex justify-between items-center">
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Observed on</Pill>
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">
                      {(priciestDiesel.observed_date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Pill>
                  </div>
                </TextureCard>
  
              </div>
          
            </div>
          </div>
        </div>

        {/* Country comparison section */}
        <div id="compare-countries">
          <CountryComparison prices={fuelPrices} />
        </div>

        {/* Trend section */}
        <div className="flex flex-col border-t border-black lg:flex-row justify-center items-center py-30 px-4 md:px-20 gap-9 lg:gap-20">
          <div className="lg:max-w-xl">
            <h2 className="mb-8 font-serif text-7xl md:text-8xl font-medium text-black text-center lg:text-left">
              Explore Fuel Price History
            </h2>

            <p className="mb-12 text-center text-lg md:text-xl font-medium text-black/50 lg:text-left">
              See how fuel prices have changed over the past 25 years.
            </p>
          </div>
          <HistoricalFuelChart prices={fuelPrices} />
        </div>

        {/* About data */}
        <div id="about-data" className="flex flex-col w-full gap-12 px-2 justify-center border-t border-black items-center bg-accent-yellow pt-30 pb-4">
          <div className="flex flex-col lg:max-w-6xl md:px-20 md:mb-12 lg:px-4 px-4 gap-9">
            <h2 className="mb-8 font-serif text-7xl lg:text-8xl font-medium text-black text-center">
              About the data
            </h2>
            <div className="grid grid-cols-2 gap-9 md:gap-8 lg:grid-cols-4">
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-3xl md:text-4xl">
                  Source
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  European Commission Weekly Oil Bulletin
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-3xl md:text-4xl">
                  Frequency
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  Updated each Thursday, with data observed on Monday.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-3xl md:text-4xl">
                  Coverage
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  27 European countries
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-3xl md:text-4xl">
                  Prices
                </h3>
                <p className="text-base md:text-lg text-muted-foreground">
                  EUR / litre, including taxes
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full items-center justify-center px-4 md:px-16 xl:px-40 py-20 gap-12 bg-black rounded-lg">
            <h3 className="font-serif text-6xl mb-12 text-center text-accent-yellow">
              How the data gets here
            </h3>
            <div className="flex flex-col md:gap-18 gap-12 lg:flex-row">
              <div className="flex flex-col md:w-3xl xl:w-xl w-full lg:justify-between lg:items-center lg:gap-20 min-h-full ">
                <div className="relative w-full h-70 xl:h-90">
                  <Image
                    src={'/graph-process.svg'}
                    alt="Graph of data engineering process"
                    fill
                    preload={true}
                    
                    sizes="(max-width: 768px) 100vw, 600px"
                  >
                  </Image>
                </div>
                <div className="w-full space-y-8 hidden xl:block">
                  <p className="text-background font-semibold uppercase tracking-wider text-sm md:text-base text-center">
                    Last updated on {" "}
                    {latestDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex flex-col md:flex-row md:justify-center gap-6 items-center justify-center ">
                    <Link
                      className="bg-background flex gap-2 rounded-sm px-4 py-2 text-center text-lg font-medium"
                      href="https://github.com/aurahu/eu-fuel-price-explorer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <GithubLogoIcon weight="light" color="var(--color-black)" size={24} />
                      </span>
                        View Source Code
                    </Link>
                    <a
                      className="text-center text-lg text-background underline underline-offset-3 font-medium"
                      href="#home">
                      Back to top
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:grid md:grid-cols-2 lg:max-w-2xl gap-12 px-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium md:text-2xl text-background">
                    Source
                  </h3>
                  <p className="text-base md:text-xl text-light-gray">
                    European Commission Weekly Oil Bulletin
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium md:text-2xl text-background">
                    Python
                  </h3>
                  <p className="text-base md:text-xl text-light-gray">
                    Downloads and validates the source files before loading them into the database.
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium md:text-2xl text-background">
                    PostgreSQL
                  </h3>
                  <p className="text-base md:text-xl text-light-gray">
                    Stores the raw source data and provides the database layer for the dashboard.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium md:text-2xl text-background">
                    dbt
                  </h3>
                  <p className="text-base md:text-xl text-light-gray">
                    Transforms the raw data into analysis-ready tables and runs data-quality tests before the data is used by the dashboard.
                  </p>
      
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium md:text-2xl text-background">
                    Dashboard
                  </h3>
                  <p className="text-base md:text-xl text-light-gray">
                    Next.js queries the transformed data to generate the charts and comparisons shown here.
                  </p>
                </div>

                <div className="w-full space-y-8 mt-12 xl:hidden">
                  <p className="text-background font-semibold uppercase tracking-wider text-sm md:text-base text-center md:text-left">
                    Last updated on {" "}
                    {latestDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex flex-col gap-6 items-center justify-center md:items-start ">
                    <Link
                      className="bg-background flex gap-2 rounded-sm px-4 py-2 text-center text-lg font-medium"
                      href="https://github.com/aurahu/eu-fuel-price-explorer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>
                        <GithubLogoIcon weight="light" color="var(--color-black)" size={24} />
                      </span>
                        View Source Code
                    </Link>
                    <a
                      className="text-center text-lg text-background underline underline-offset-3 font-medium"
                      href="#home">
                      Back to top
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
