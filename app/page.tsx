import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-2xl font-bold">
            AI<span className="text-zinc-400">Orbit</span>
          </Link>

          <div className="hidden gap-8 text-sm text-zinc-400 md:flex">
            <Link href="/tools" className="hover:text-white">
              Tools
            </Link>
            <Link href="/tools" className="hover:text-white">
              Explore
            </Link>
          </div>

          <Link
            href="/tools"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Explore Tools
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Your AI discovery platform
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Discover AI tools.
            <span className="block text-zinc-500">
              Unlock new possibilities.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Explore AI tools for productivity, coding, design, research,
            writing and more. Find the right tools for your next idea.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200"
            >
              Explore AI Tools →
            </Link>

            <Link
              href="/tools"
              className="rounded-xl border border-zinc-700 px-7 py-4 font-medium text-white transition hover:bg-zinc-900"
            >
              Browse Directory
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            {
              number: "01",
              title: "Discover",
              description: "Explore AI tools across different categories.",
            },
            {
              number: "02",
              title: "Compare",
              description: "Browse tool information and ratings.",
            },
            {
              number: "03",
              title: "Save",
              description: "Bookmark tools you want to revisit.",
            },
          ].map((item) => (
            <Link
              key={item.number}
              href="/tools"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-600"
            >
              <p className="text-sm text-zinc-500">{item.number}</p>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
              <p className="mt-5 text-sm text-zinc-300">
                Explore directory →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-sm text-zinc-500">
        AI Orbit — Discover tools that move you forward.
      </footer>
    </main>
  );
}