import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import InputField from "../forms/InputField";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function Login({
  onNavigateSignUp,
  onBackToPublic,
  onForgotPassword,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      const { user, token } = response.data.data;

      // Save user & token in state and localStorage
      login(user, token);

      // Redirect using centralized role routing
      const targetPath = getRedirectPath(user.role);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <div className="mb-2">
        <button
          type="button"
          onClick={onBackToPublic || (() => navigate("/"))}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to home
        </button>
      </div>

      <div className="pt-2 pb-1">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-text-muted">
            Log in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 rounded border border-red-200 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="EMAIL ADDRESS"
            type="email"
            name="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="PASSWORD"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-3 text-xs">
          <p className="text-text-muted">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>

          <div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-primary font-medium hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </FormCard>
  );
}