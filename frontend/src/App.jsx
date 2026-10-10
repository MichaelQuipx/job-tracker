import StatusBadge from "./components/StatusBadge";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-700">Job Tracker</h1>

      <div className="mt-4 flex gap-2">
        <StatusBadge status="applied" />
        <StatusBadge status="interview" />
        <StatusBadge status="offer" />
        <StatusBadge status="rejected" />
      </div>
    </div>
  );
}

export default App;
