import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/api";
import FormField from "../components/FormField";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, register } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      ...(name === "password_confirmation" ? { password: prev.password } : {}),
    }));

    setFormError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.errors ?? {});
      } else {
        setFormError(
          err instanceof TypeError
            ? "Unable to connect to the server. Please try again."
            : err.message || "Registration failed. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-2 text-2xl font-bold text-blue-700">
          Create an account
        </h1>

        <p className="mb-6 text-sm text-gray-600">
          Register to start tracking your job applications.
        </p>

        {formError && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          >
            {formError}
          </p>
        )}

        <div className="grid gap-4">
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name?.[0]}
            autoComplete="name"
            required
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email?.[0]}
            autoComplete="email"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password?.[0]}
            autoComplete="new-password"
            required
          />

          <FormField
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
