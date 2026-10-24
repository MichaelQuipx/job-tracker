const cards = [
  { key: "total", label: "Total", style: "text-gray-900" },
  { key: "applied", label: "Applied", style: "text-blue-700" },
  { key: "interview", label: "Interview", style: "text-yellow-700" },
  { key: "offer", label: "Offer", style: "text-green-700" },
  { key: "rejected", label: "Rejected", style: "text-red-700" },
];

function StatsRow({ counts }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {cards.map((c) => (
        <div key={c.key} className="rounded-lg bg-white p-4 text-center shadow">
          <p className={`text-2xl font-bold ${c.style}`}>
            {counts[c.key] ?? 0}
          </p>
          <p className="text-sm text-gray-500">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

export default StatsRow;
