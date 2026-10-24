import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormField from "../components/FormField";
import { api, ApiError } from "../lib/api";

const initialForm = {
  company: "",
  position: "",
  location: "",
  job_url: "",
  status: "applied",
  applied_date: "",
  interview_date: "",
  salary: "",
  notes: "",
};

function toFormValues(app) {
  const values = Object.fromEntries(
    Object.keys(initialForm).map((key) => [key, app[key] ?? ""]),
  );

  values.interview_date = app.interview_date
    ? app.interview_date.slice(0, 16)
    : "";

  return values;
}

function ApplicationFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;

    async function load() {
      try {
        const app = await api(`/applications/${id}`);
        setForm(toFormValues(app));
      } catch (err) {
        setLoadError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, isEdit]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrors({});
    setFormError("");
    setSubmitting(true);

    try {
      await api(isEdit ? `/applications/${id}` : "/applications", {
        method: isEdit ? "PATCH" : "POST",
        body: form,
      });

      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.errors);
      } else {
        setFormError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="text-sm text-blue-600 underline">
          &larr; Back to dashboard
        </Link>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading...</p>
        ) : loadError ? (
          <p
            role="alert"
            className="mt-4 rounded bg-red-100 p-3 text-sm text-red-700"
          >
            Failed to load application: {loadError}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-4 rounded-lg bg-white p-6 shadow"
          >
            <h1 className="mb-4 text-2xl font-bold text-blue-700">
              {isEdit ? "Edit application" : "Add application"}
            </h1>

            {formError && (
              <p
                role="alert"
                className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}

            <FormField
              label="Company"
              name="company"
              value={form.company}
              onChange={handleChange}
              error={errors.company?.[0]}
            />

            <FormField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              error={errors.position?.[0]}
            />

            <FormField
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              error={errors.location?.[0]}
            />

            <FormField
              label="Job URL"
              name="job_url"
              type="url"
              value={form.job_url}
              onChange={handleChange}
              error={errors.job_url?.[0]}
            />

            <FormField
              label="Status"
              name="status"
              as="select"
              value={form.status}
              onChange={handleChange}
              error={errors.status?.[0]}
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </FormField>

            <FormField
              label="Applied Date"
              name="applied_date"
              type="date"
              value={form.applied_date}
              onChange={handleChange}
              error={errors.applied_date?.[0]}
            />

            <FormField
              label="Interview Date"
              name="interview_date"
              type="datetime-local"
              value={form.interview_date}
              onChange={handleChange}
              error={errors.interview_date?.[0]}
            />

            <FormField
              label="Salary"
              name="salary"
              type="number"
              min="0"
              value={form.salary}
              onChange={handleChange}
              error={errors.salary?.[0]}
            />

            <FormField
              label="Notes"
              name="notes"
              as="textarea"
              rows="4"
              value={form.notes}
              onChange={handleChange}
              error={errors.notes?.[0]}
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEdit
                  ? "Save changes"
                  : "Save application"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplicationFormPage;
