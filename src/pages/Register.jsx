import { useState } from "react";
import { registerUser } from "../api/authApi";

function Register({ onRegister, onNavigate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Save JWT
      localStorage.setItem("devdash_token", data.token);

      // Save user information
      localStorage.setItem(
        "devdash_user",
        JSON.stringify(data.user)
      );

      // Tell App registration was successful
      onRegister(data.user);
    } catch (error) {
      console.error("Registration failed:", error);

      setError(
        error.message || "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-xl font-bold text-white">
            D
          </div>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Create your DevDash account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Start managing your productivity workspace
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-lg font-semibold text-slate-900">
            Sign up
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create your account to get started.
          </p>

          {/* Error */}
          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;