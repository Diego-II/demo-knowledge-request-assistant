// Navigation component - Server component
// Provides consistent navigation across all pages

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
        >
          🏠 Home
        </Link>
      </div>
    </nav>
  );
}

