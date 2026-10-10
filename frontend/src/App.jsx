import { useState } from "react";
import ApplicationCard from "./components/ApplicationCard";
const sampleApplications = [
  {
    id: 1,
    company: "Acme",
    position: "Developer",
    status: "applied",
    applied_date: "2026-10-10",
  },
  {
    id: 2,
    company: "Beta Corp",
    position: "Designer",
    status: "interview",
    applied_date: "2026-10-08",
  },
  {
    id: 3,
    company: "Gamma Ltd",
    position: "QA Engineer",
    status: "offer",
    applied_date: "2026-10-01",
  },
  {
    id: 4,
    company: "Delta Inc",
    position: "Support Lead",
    status: "rejected",
    applied_date: "2026-09-25",
  },
];
const filters = ["all", "applied", "interview", "offer", "rejected"];

function App() {
  const [filter, setFilter] = useState("all");
  const visibleApplications =
    filter === "all"
      ? sampleApplications
      : sampleApplications.filter((app) => app.status === filter);
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
      <div className="mt-6 grid gap-4">
        {visibleApplications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}

export default App;
