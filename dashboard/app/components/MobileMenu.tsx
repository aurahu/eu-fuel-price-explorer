"use client";

import { useState } from "react";
import {
    ListIcon,
    XIcon,
    GithubLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function MobileMenu() {
    const [menuOpen, setMenuOpen] = useState(false);

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    return (
        <>
            <header className="w-full sticky inset-0 bg-accent-yellow border-b border-black z-50 flex md:hidden items-center justify-between px-4 py-5">
                <a href="#home">
                    <img
                        src="/logo.svg"
                        width={120}
                        alt="Logo"
                    />
                </a>

                <button onClick={toggleMenu}>
                    <ListIcon weight="light" size={32} />
                </button>
            </header>

            <div
                className={`
                    h-dvh fixed inset-0 z-50 w-full
                    bg-black flex flex-col justify-between py-5
                    transition-[transform,opacity] duration-200 ease-out
                    ${
                        menuOpen
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-full opacity-0 pointer-events-none"
                    }
                `}
            >
                <div className="flex justify-between px-4">
                    <a href="#home" onClick={toggleMenu}>
                        <img
                            src="/light-logo.svg"
                            width={120}
                            alt="Logo"
                        />
                    </a>
                    
                    <button onClick={toggleMenu}>
                        <XIcon
                            weight="light"
                            size={32}
                            color="var(--color-background)"
                        />
                    </button>
                </div>

                <menu className="flex flex-col gap-6 px-4">
                    <a
                        onClick={toggleMenu}
                        href="#cheapest-fuel-last-week"
                        className="text-5xl font-serif text-background hover:text-background/60"
                    >
                        Latest prices
                    </a>

                    <a
                        onClick={toggleMenu}
                        href="#compare-countries"
                        className="text-5xl font-serif text-background hover:text-background/60"
                    >
                        Compare
                    </a>

                    <a
                        onClick={toggleMenu}
                        href="#trends"
                        className="text-5xl font-serif text-background hover:text-background/60"
                    >
                        Trends
                    </a>

                    <a
                        onClick={toggleMenu}
                        href="#about-data"
                        className="text-5xl font-serif text-background hover:text-background/60"
                    >
                        About data
                    </a>
                </menu>

                <div className="block">
                    <Link
                        className="bg-black text-background flex gap-2 rounded-sm font-sans px-4 py-2 text-center text-lg font-normal"
                        href="https://github.com/aurahu/eu-fuel-price-explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GithubLogoIcon
                            weight="light"
                            color="var(--color-background)"
                            size={24}
                        />
                        <span>View on GitHub</span>
                    </Link>
                </div>
            </div>
        </>
    );
}