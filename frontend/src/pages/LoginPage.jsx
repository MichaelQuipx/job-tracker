import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the dashboard.
  if (user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof TypeError
          ? "Unable to connect to the server. Please try again."
          : err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-2xl font-bold text-blue-700">Log in</h1>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />

        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 mb-4 w-full rounded border border-gray-300 px-3 py-2"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
