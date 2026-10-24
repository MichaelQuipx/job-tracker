import { useState, useEffect } from "react";
import ApplicationCard from "../components/ApplicationCard";
import StatsRow from "../components/StatsRow";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

const filters = ["all", "applied", "interview", "offer", "rejected"];

function DashboardPage() {
  const [filter, setFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [actionError, setActionError] = useState("");

  const counts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    },
    { total: applications.length },
  );

  async function handleLogout() {
    await api("/logout", { method: "POST" });
  }

  async function handleDelete(id) {
    setActionError("");

    if (!window.confirm("Delete this application?")) return;

    try {
      await api(`/applications/${id}`, {
        method: "DELETE",
      });

      setApplications((current) => current.filter((app) => app.id !== id));
    } catch (err) {
      setActionError(err.message);
    }
  }

  async function handleStatusChange(id, status) {
    setActionError("");

    try {
      const updated = await api(`/applications/${id}`, {
        method: "PATCH",
        body: { status },
      });

      setApplications((current) =>
        current.map((app) => (app.id === id ? updated : app)),
      );
    } catch (err) {
      setActionError(err.message);
    }
  }

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await api("/applications");
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const query = search.trim().toLowerCase();

  // Step 1: Filter by status
  const statusFiltered = applications.filter((app) => {
    return filter === "all" || app.status === filter;
  });

  // Step 2: Filter by company or position
  const searchFiltered = statusFiltered.filter((app) => {
    return (
      app.company.toLowerCase().includes(query) ||
      app.position.toLowerCase().includes(query)
    );
  });

  // Step 3: Sort a copy of the filtered array
  const visibleApplications = [...searchFiltered].sort((a, b) => {
    if (sort === "newest") {
      return b.applied_date.localeCompare(a.applied_date);
    }

    if (sort === "oldest") {
      return a.applied_date.localeCompare(b.applied_date);
    }

    if (sort === "company") {
      return a.company.localeCompare(b.company);
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-blue-700">Job Tracker</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/applications/new"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Add application
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-white shadow transition hover:bg-red-700"
          >
            Log out
          </button>
        </div>
      </header>
      <StatsRow counts={counts} />

      {/* Search and sort controls */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <label
            htmlFor="application-search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search applications
          </label>
          <input
            id="application-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or position..."
            aria-label="Search company or position"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="application-sort"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>
          <select
            id="application-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort applications"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-48"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="company">Company (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Status filter buttons */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Filter by status
        </p>

        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="ml-1 opacity-80">
                ({f === "all" ? counts.total : (counts[f] ?? 0)})
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="mt-6 text-gray-600">Loading...</p>}

      {error && (
        <p role="alert" className="mt-6 text-red-600">
          {error}
        </p>
      )}
      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700"
        >
          {actionError}
        </p>
      )}

      {!loading && !error && visibleApplications.length === 0 && (
        <p className="mt-6 text-gray-600">
          {search.trim()
            ? "No applications match your search."
            : "No applications found."}
        </p>
      )}

      {!loading && !error && visibleApplications.length > 0 && (
        <div className="mt-6 grid gap-4">
          {visibleApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
