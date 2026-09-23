import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-accent-yellow px-6 text-center">

      <span className="mb-6 font-digital text-7xl text-black">
        404
      </span>

      <h1 className="mb-4 font-serif text-5xl font-medium text-black md:text-6xl">
        Page not found
      </h1>

      <p className="mb-12 max-w-md font-sans text-lg text-black/50">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link
        href="/"
        className="rounded-sm bg-black px-4 py-2 font-sans text-base font-semibold text-background transition-opacity hover:opacity-90"
      >
        Back to dashboard
      </Link>

    </main>
  );
}