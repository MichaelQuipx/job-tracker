import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const statuses = ["applied", "interview", "offer", "rejected"];

function ApplicationCard({ application, onDelete, onStatusChange }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{application.position}</h2>
          <p className="text-gray-600">{application.company}</p>
          {application.location && (
            <p className="text-sm text-gray-500">{application.location}</p>
          )}

          {application.job_url && (
            <a
              href={application.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline"
            >
              View posting
            </a>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Applied: {application.applied_date}
        </p>

        <div className="flex items-center gap-2">
          <select
            aria-label="Change status"
            value={application.status}
            onChange={(e) => onStatusChange(application.id, e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-sm capitalize"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <Link
            to={`/applications/${application.id}/edit`}
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
          >
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(application.id)}
            className="rounded bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
