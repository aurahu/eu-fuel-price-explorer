import { getCheapestDiesel, getCheapestPetrol, getLatestFuelPrices, getLatestObservedDate, getPriciestDiesel, getPriciestPetrol } from "@/lib/queries/fuel-prices";
import Image from "next/image";
import TextureCard from "./components/TextureCard";
import Pill from "./components/Pill";
import TabPanel from "./components/TabPanel";
import CountryComparison from "./components/CountryComparison";


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
        <div className="flex flex-col md:h-dvh md:flex-row w-full justify-center items-center md:border-b md:border-black">

          <div className="flex flex-col w-full items-center justify-center md:items-start gap-12 px-4 py-20 md:px-12 border-y border-black md:border-none">
            <div className="flex flex-row gap-2 md:gap-4 bg-black px-6 py-2 items-center justify-center">
              <div className="w-2 h-2 bg-success blur-[2px] rounded-full" />
              <p className="text-background font-semibold uppercase tracking-wider text-sm">
                Last updated on {" "}
                {latestDate.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <h1 className="text-6xl md:text-8xl md:text-left font-serif text-black text-center">
              Fuel prices across the <span className="italic">European Union</span>, updated weekly.
            </h1>
          </div>

          <div className="relative w-full md:w-50% h-100 md:h-175">
            <Image
              src={'/hero-img.webp'}
              alt="European Union Fuel Price Tracking"
              fill
              preload={true}
              objectFit="cover"
              sizes="(max-width: 768px) 100wv, 160px"
            >
            </Image>
          </div>
        </div>

        {/* Cheapest price section */}
        <div className="w-full flex flex-col items-center justify-center">
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

          <div className="flex flex-col md:flex-row w-full pt-25 pb-4 md:py-25 gap-12 lg:max-w-7xl items-center justify-center">
            <h2 className="font-serif text-6xl md:text-8xl text-center md:text-left px-4">
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

                {/* Last updated */}
                <div className="w-full flex justify-between items-center">
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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

                {/* Last updated */}
                <div className="w-full flex justify-between items-center">
                  <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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
        <div className="w-full flex flex-col justify-center items-center">
          <div className="relative w-full overflow-hidden min-h-200 py-6">
            {/* BG image */}
            <Image
              src={"/texture-2.avif"}
              alt=""
              fill
              className="object-cover pointer-events-none"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/85 z-10" />

            {/* Content */}
            <div className=" w-full flex flex-col justify-center gap-20 py-30 items-center relative z-20">
              <h2 className="font-serif text-[56px] leading-[100%] md:text-8xl md:max-w-4xl text-center text-background px-4">
                The <span className="italic">highest</span> fuel prices were found in {priciestPetrol.country} and {priciestDiesel.country}.
              </h2>

              {/* Most expensive (mobile) */}
              <div className="relative md:hidden z-30 w-full">
                <TabPanel  tabs={[
                  {
                    label: "Petrol (95)",
                    color: "#FFF8E8",
                    content:
                    <div className="flex flex-col w-full px-4 py-20 gap-9">
                      <p className="font-serif text-center text-4xl">
                      € {""}
                        <span className="font-digital text-7xl h-18">{Number(priciestPetrol.price_eur_per_litre).toFixed(3)}</span>
                       {""} /L
                      </p>
                      <p className="font-serif mb-6 text-center text-4xl">
                        in{""} {priciestPetrol.country}
                      </p>

                      {/* Last updated */}
                      <div className="w-full flex justify-between items-center">
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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
                    <div className="flex flex-col w-full px-4 py-20 gap-9">
                      <p className="font-serif text-center text-4xl">
                      € {""}
                        <span className="font-digital text-7xl h-18">{Number(priciestDiesel.price_eur_per_litre).toFixed(3)}</span>
                       {""} /L
                      </p>
                      <p className="font-serif mb-6 text-center text-4xl">
                        in{""} {priciestDiesel.country}
                      </p>

                      {/* Last updated */}
                      <div className="w-full flex justify-between items-center">
                        <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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

                  {/* Last updated */}
                  <div className="w-full flex justify-between items-center">
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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

                  {/* Last updated */}
                  <div className="w-full flex justify-between items-center">
                    <Pill className="text-gray-on-yellow text-sm!" variant="ghost">Last updated</Pill>
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
        <div>
          <CountryComparison prices={fuelPrices} />


        </div>

      </main>
    </div>
  );
}
