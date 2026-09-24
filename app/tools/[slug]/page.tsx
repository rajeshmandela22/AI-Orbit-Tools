"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Tool = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  pricing: string;
  website: string;
  features: string[];
  about: string;
};

export default function ToolDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [tool, setTool] = useState<Tool | null>(null);
  const [relatedTools, setRelatedTools] = useState<Tool[]>([]);

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookmarked, setBookmarked] = useState(false);

  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [submittedReview, setSubmittedReview] = useState("");

  /*
   * Load bookmark and review from localStorage
   */
  useEffect(() => {
    if (!slug) return;

    const savedBookmark = localStorage.getItem(
      `bookmark-${slug}`
    );

    const savedReview = localStorage.getItem(
      `review-${slug}`
    );

    const savedRating = localStorage.getItem(
      `review-rating-${slug}`
    );

    setBookmarked(savedBookmark === "true");

    if (savedReview) {
      setSubmittedReview(savedReview);
    }

    if (savedRating) {
      setUserRating(Number(savedRating));
    }
  }, [slug]);

  /*
   * Load selected tool from backend
   */
  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function fetchTool() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:4000/api/tools/${encodeURIComponent(
            slug
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Tool not found.");
        }

        const data: Tool = await response.json();

        setTool(data);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
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

    fetchTool();

    return () => controller.abort();
  }, [slug]);

  /*
   * Load related tools from backend
   */
  useEffect(() => {
    if (!tool) return;

    const controller = new AbortController();

    async function fetchRelatedTools() {
      setRelatedLoading(true);

      try {
        const response = await fetch(
          `http://localhost:4000/api/tools?category=${encodeURIComponent(
            tool.category
          )}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load related tools.");
        }

        const data: { count: number; tools: Tool[] } =
          await response.json();

        const related = data.tools
          .filter((item) => item.slug !== tool.slug)
          .slice(0, 3);

        setRelatedTools(related);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        setRelatedTools([]);
      } finally {
        if (!controller.signal.aborted) {
          setRelatedLoading(false);
        }
      }
    }

    fetchRelatedTools();

    return () => controller.abort();
  }, [tool]);

  /*
   * Bookmark
   */
  function toggleBookmark() {
    const newBookmarkState = !bookmarked;

    setBookmarked(newBookmarkState);

    localStorage.setItem(
      `bookmark-${slug}`,
      String(newBookmarkState)
    );
  }

  /*
   * Submit review
   */
  function submitReview() {
    if (!userRating || !reviewText.trim()) {
      return;
    }

    const review = reviewText.trim();

    setSubmittedReview(review);

    localStorage.setItem(
      `review-${slug}`,
      review
    );

    localStorage.setItem(
      `review-rating-${slug}`,
      String(userRating)
    );

    setReviewText("");
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-center text-white">
        <h1 className="text-2xl font-semibold">
          Loading tool details...
        </h1>

        <p className="mt-3 text-zinc-500">
          Connecting to AI Orbit API
        </p>
      </main>
    );
  }

  /*
   * Error state
   */
  if (error || !tool) {
    return (
      <main className="min-h-screen bg-black px-6 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">
          Tool not found
        </h1>

        <p className="mt-3 text-zinc-400">
          {error || "This tool does not exist."}
        </p>

        <Link
          href="/tools"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-3 text-black"
        >
          Back to tools
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            AI<span className="text-zinc-400">Orbit</span>
          </Link>

          <div className="hidden gap-8 text-sm text-zinc-400 md:flex">
            <Link
              href="/"
              className="hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/tools"
              className="text-white"
            >
              Tools
            </Link>

            <Link
              href="/companies"
              className="hover:text-white"
            >
              Companies
            </Link>

            <Link
              href="/learn"
              className="hover:text-white"
            >
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

      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Back */}
        <Link
          href="/tools"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Back to AI tools
        </Link>

        {/* Hero */}
        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-start">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-4xl font-bold">
              {tool.name.charAt(0)}
            </div>

            <div className="flex-1">

              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                {tool.category}
              </span>

              <h1 className="mt-5 text-4xl font-bold md:text-5xl">
                {tool.name}
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
                {tool.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">

                <span>
                  ★ {Number(tool.rating).toFixed(1)}
                </span>

                <span>
                  {tool.reviews.toLocaleString()} reviews
                </span>

                <span>
                  {tool.pricing}
                </span>

              </div>

              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200"
                >
                  Visit website ↗
                </a>

                <button
                  type="button"
                  onClick={toggleBookmark}
                  aria-pressed={bookmarked}
                  className="rounded-xl border border-zinc-700 px-6 py-3 text-sm transition hover:bg-zinc-900"
                >
                  {bookmarked
                    ? "★ Saved"
                    : "☆ Save tool"}
                </button>

              </div>

            </div>

          </div>

        </section>

        {/* Main content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="space-y-8 lg:col-span-2">

            {/* About */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <h2 className="text-2xl font-semibold">
                About {tool.name}
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                {tool.about}
              </p>

            </section>

            {/* Features */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <h2 className="text-2xl font-semibold">
                Key features
              </h2>

              <div className="mt-5 space-y-3">

                {tool.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 p-4"
                  >

                    <span className="text-white">
                      ✓
                    </span>

                    <span className="text-sm text-zinc-300">
                      {feature}
                    </span>

                  </div>
                ))}

              </div>

            </section>

            {/* Reviews */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <h2 className="text-2xl font-semibold">
                Ratings & reviews
              </h2>

              <div className="mt-5 flex items-center gap-4">

                <span className="text-4xl font-bold">
                  {Number(tool.rating).toFixed(1)}
                </span>

                <div>

                  <div className="text-yellow-400">
                    ★★★★★
                  </div>

                  <p className="mt-1 text-sm text-zinc-500">
                    Based on{" "}
                    {tool.reviews.toLocaleString()} sample reviews
                  </p>

                </div>

              </div>

              <div className="mt-8 border-t border-zinc-800 pt-6">

                <h3 className="font-semibold">
                  Write a review
                </h3>

                {/* Rating selector */}
                <div
                  className="mt-4 flex gap-2"
                  aria-label="Choose a rating"
                >

                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setUserRating(rating)
                      }
                      aria-label={`${rating} star${
                        rating > 1 ? "s" : ""
                      }`}
                      aria-pressed={
                        userRating === rating
                      }
                      className={`text-2xl transition ${
                        rating <= userRating
                          ? "text-yellow-400"
                          : "text-zinc-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}

                </div>

                {/* Review input */}
                <textarea
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(event.target.value)
                  }
                  placeholder="Share your experience with this tool..."
                  rows={4}
                  className="mt-4 w-full rounded-xl border border-zinc-800 bg-black p-4 text-sm outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                />

                <button
                  type="button"
                  onClick={submitReview}
                  disabled={
                    !userRating ||
                    !reviewText.trim()
                  }
                  className="mt-4 rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Submit review
                </button>

                {/* Saved review */}
                {submittedReview && (
                  <div className="mt-5 rounded-xl border border-zinc-700 p-4">

                    <p className="text-sm text-yellow-400">
                      {"★".repeat(userRating)}
                      {"☆".repeat(5 - userRating)}
                    </p>

                    <p className="mt-2 text-sm text-zinc-300">
                      {submittedReview}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      Your review — saved on this device
                    </p>

                  </div>
                )}

              </div>

            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Information */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <h2 className="text-lg font-semibold">
                Tool information
              </h2>

              <div className="mt-5 space-y-4 text-sm">

                <div>
                  <p className="text-zinc-500">
                    Category
                  </p>

                  <p className="mt-1 text-zinc-200">
                    {tool.category}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">
                    Pricing
                  </p>

                  <p className="mt-1 text-zinc-200">
                    {tool.pricing}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">
                    Official website
                  </p>

                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-zinc-200 underline underline-offset-4 hover:text-zinc-400"
                  >
                    {tool.website}
                  </a>
                </div>

              </div>

            </section>

            {/* Related tools */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">

              <h2 className="text-lg font-semibold">
                Related tools
              </h2>

              {relatedLoading ? (
                <p className="mt-4 text-sm text-zinc-500">
                  Loading related tools...
                </p>
              ) : relatedTools.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-500">
                  No related tools found.
                </p>
              ) : (
                <div className="mt-4 space-y-3">

                  {relatedTools.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/tools/${item.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-zinc-800 p-3 transition hover:border-zinc-600 hover:bg-zinc-900"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800 font-bold">
                        {item.name.charAt(0)}
                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {item.category}
                        </p>

                      </div>

                      <span className="ml-auto text-zinc-500">
                        →
                      </span>

                    </Link>
                  ))}

                </div>
              )}

              <Link
                href="/tools"
                className="mt-5 inline-block text-sm text-zinc-400 hover:text-white"
              >
                Browse all tools →
              </Link>

            </section>

          </aside>

        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
          AI Orbit — Discover tools that move you forward.
        </footer>

      </div>
    </main>
  );
}