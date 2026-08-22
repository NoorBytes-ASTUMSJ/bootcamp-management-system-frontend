import { useState } from "react";
<<<<<<< HEAD
import FormCard from "../common/FormCard";
import InputField from "./InputField";
import Button from "../common/Button";
=======
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import InputField from "../forms/InputField";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914

export default function Login({
  onNavigateSignUp,
  onBackToPublic,
  onForgotPassword,
<<<<<<< HEAD
  onSuccessLogin,
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
=======
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
<<<<<<< HEAD
      // 1. Attempt live backend authentication
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token || data.accessToken);
        localStorage.setItem("currentUser", JSON.stringify(data.user || data));
        setLoading(false);
        if (onSuccessLogin) onSuccessLogin();
        return;
      }
    } catch (err) {
      console.info(
        "Backend login service offline. Evaluating fallback credentials...",
      );
    }

    // 2. Fallback partner test credentials
    const validEmails = ["test.student2@astu.edu.et", "admin@astu.edu.et"];
    const validPasswords = ["Password123!", "Admin123!", "password123"];

    if (
      validEmails.includes(formData.email.trim()) &&
      validPasswords.includes(formData.password.trim())
    ) {
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhODcxZDczODEyY2I0ZTZlYzIxMmQ1NCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzg3MjM5Nzk1LCJleHAiOjE3ODc4NDQ1OTV9.E2rrotktFp3Hx6nu7TRBkYZ6ZwavMTxkXyKmuKtOVkg";

      const mockUser = {
        fullName: "Amir Test Student",
        email: formData.email.trim(),
        phone: "+251911223344",
        gender: "male",
        year: "2nd",
        department: "software",
        role: "student",
      };

      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("currentUser", JSON.stringify(mockUser));

      setLoading(false);
      if (onSuccessLogin) onSuccessLogin();
    } else {
      setLoading(false);
      setError(
        "Invalid email address or password. Please check your credentials.",
      );
=======
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
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
    }
  };

  return (
    <FormCard>
      <div className="mb-2">
        <button
          type="button"
<<<<<<< HEAD
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-inherit transition-colors cursor-pointer"
=======
          onClick={onBackToPublic || (() => navigate("/"))}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
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
<<<<<<< HEAD
          <h1 className="font-serif text-3xl font-normal text-inherit tracking-tight mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-muted">Log in to your ASTU MSJ account</p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-[#B91C1C] dark:text-red-300">
=======
          <h1 className="font-serif text-3xl font-normal text-text-primary tracking-tight mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-text-muted">
            Log in to your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 rounded border border-red-200 text-center">
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
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
<<<<<<< HEAD
            autoComplete="off"
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
            required
          />

          <InputField
            label="PASSWORD"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
<<<<<<< HEAD
            autoComplete="new-password"
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
            required
          />

          <div className="pt-2">
            <Button type="submit" disabled={loading}>
<<<<<<< HEAD
              {loading ? "Signing in..." : "Log In"}
=======
              {loading ? "Logging in..." : "Log In"}
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center space-y-3 text-xs">
<<<<<<< HEAD
          <p className="text-muted">
=======
          <p className="text-text-muted">
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
