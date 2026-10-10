import StatusBadge from "./StatusBadge";

function ApplicationCard({ application }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">{application.position}</h2>

      <p className="text-gray-600">{application.company}</p>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={application.status} />

        <p className="text-sm text-gray-500">
          Applied: {application.applied_date}
        </p>
      </div>
    </div>
  );
}

export default ApplicationCard;
