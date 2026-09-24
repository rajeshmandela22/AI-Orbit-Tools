"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tool = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  rating: number;
};

const categories = [
  "All",
  "Productivity",
  "Development",
  "Design",
  "Image Generation",
  "Research",
];

export default function ToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"Grid" | "List">("Grid");

  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchTools() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category !== "All") {
          params.set("category", category);
        }

        const response = await fetch(
          `http://localhost:4000/api/tools?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to load tools.");
        }

        const data: { count: number; tools: Tool[] } =
          await response.json();

        setTools(data.tools);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          "Could not connect to the AI Orbit API. Please check that your backend is running."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTools();

    return () => controller.abort();
  }, [search, category]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            AI<span className="text-zinc-400">Orbit</span>
          </Link>

          <div className="hidden gap-8 text-sm text-zinc-400 md:flex">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <Link href="/tools" className="text-white">
              Tools
            </Link>
            <Link href="/companies" className="hover:text-white">
              Companies
            </Link>
            <Link href="/learn" className="hover:text-white">
              Learn
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Sign In
          </button>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-3 text-sm uppercase tracking-widest text-zinc-500">
            Explore
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            AI Tools
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Discover AI tools for productivity, development, design,
            research and more.
          </p>
        </div>

        <div className="mb-8">
          <label
            htmlFor="tool-search"
            className="mb-2 block text-sm text-zinc-400"
          >
            Search tools
          </label>

          <input
            id="tool-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try ChatGPT, design, coding..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-500"
          />
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                category === item
                  ? "bg-white text-black"
                  : "border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-zinc-500" aria-live="polite">
            {loading
              ? "Loading tools..."
              : `${tools.length} ${
                  tools.length === 1 ? "tool" : "tools"
                } found`}
          </p>

          <div className="flex overflow-hidden rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setView("Grid")}
              aria-pressed={view === "Grid"}
              className={`px-4 py-2 text-sm ${
                view === "Grid"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Grid
            </button>

            <button
              type="button"
              onClick={() => setView("List")}
              aria-pressed={view === "List"}
              className={`px-4 py-2 text-sm ${
                view === "List"
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {loading ? (
          <div
            className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-16 text-center"
            role="status"
          >
            <p className="text-zinc-300">Loading AI tools...</p>
            <p className="mt-2 text-sm text-zinc-500">
              Connecting to the API
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-900 bg-zinc-950 px-6 py-16 text-center">
            <h2 className="text-xl font-semibold">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch((current) => current);
                window.location.reload();
              }}
              className="mt-5 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Try again
            </button>
          </div>
        ) : tools.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-16 text-center">
            <div className="mb-4 text-4xl">⌕</div>

            <h2 className="text-xl font-semibold">
              No tools found
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Try another search or choose a different category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className={
              view === "Grid"
                ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-3"
            }
          >
            {tools.map((tool) => (
              <article
                key={tool.id}
                className={`group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600 ${
                  view === "List"
                    ? "flex flex-col gap-4 sm:flex-row sm:items-center"
                    : ""
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-800 text-xl font-bold">
                  {tool.name.charAt(0)}
                </div>

                <div className={view === "List" ? "flex-1" : ""}>
                  <p className="mt-5 text-xs uppercase tracking-wider text-zinc-500">
                    {tool.category}
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {tool.name}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {tool.description}
                  </p>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between border-t border-zinc-800 pt-5 ${
                    view === "List"
                      ? "sm:mt-0 sm:min-w-32 sm:border-0 sm:pt-0"
                      : ""
                  }`}
                >
                  <span className="text-sm text-zinc-400">
                    ★ {Number(tool.rating).toFixed(1)}
                  </span>

                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm font-medium text-white hover:text-zinc-400"
                  >
                    View details →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        AI Orbit — Discover tools that move you forward.
      </footer>
    </main>
  );
}