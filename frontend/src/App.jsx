import { useState, useEffect } from "react";
import ApplicationCard from "./components/ApplicationCard";

const filters = ["all", "applied", "interview", "offer", "rejected"];

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [filter, setFilter] = useState("all");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        const response = await fetch(`${API_URL}/applications`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);
  const visibleApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700">Job Tracker</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-3 py-1 capitalize shadow transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="mt-6 text-gray-600">Loading...</p>}

      {error && <p className="mt-6 text-red-600">{error}</p>}

      {!loading && !error && visibleApplications.length === 0 && (
        <p className="mt-6 text-gray-600">No applications found.</p>
      )}

      {!loading && !error && visibleApplications.length > 0 && (
        <div className="mt-6 grid gap-4">
          {visibleApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
