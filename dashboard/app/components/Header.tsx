import Link from "next/link";
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import MobileMenu from "./MobileMenu";

export default function Header(){
    return (
        <>

        <header className="w-full hidden md:flex bg-accent-yellow items-center py-4 px-4 sticky top-0 z-100 justify-between border-b border-black">
            <a href="#home" className="flex gap-9 items-center">
                <img src="/logo.svg" width={120}></img>
            </a>
            <menu className="flex gap-6">
                <a href="#cheapest-fuel-last-week" className="text-sm tracking-wide uppercase font-sans text-black/80 font-semibold hover:text-black hover:underline hover:underline-offset-2 active:text-black">
                    Latest
                </a>
                <a href="#compare-countries" className="text-sm tracking-wide uppercase font-sans text-black/80 font-semibold hover:text-black hover:underline hover:underline-offset-2 active:text-black">
                    Compare
                </a>
                <a href="#trends" className="text-sm tracking-wide uppercase font-sans text-black/80 font-semibold hover:text-black hover:underline hover:underline-offset-2 active:text-black">
                    Trends
                </a>
                <a href="#about-data" className="text-sm tracking-wide uppercase font-sans text-black/80 font-semibold hover:text-black hover:underline hover:underline-offset-2 active:text-black">
                    About data
                </a>
            </menu>
            <div className="block">
                <Link
                    className="bg-black text-background flex gap-2 rounded-sm font-sans px-4 py-2 text-center text-base font-semibold"
                    href="https://github.com/aurahu/eu-fuel-price-explorer"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>
                    <GithubLogoIcon weight="light" color="var(--color-background)" size={24} />
                    </span>
                    View on GitHub
                </Link>
            </div>

        </header>

        <MobileMenu />

        </>

    );

}