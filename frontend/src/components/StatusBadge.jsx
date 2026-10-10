function StatusBadge({ status }) {
  const colors = {
    applied: "bg-blue-100 text-blue-800",
    interview: "bg-yellow-100 text-yellow-800",
    offer: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
