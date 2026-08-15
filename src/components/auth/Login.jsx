import { useState } from "react";
import FormCard from "../ui/FormCard";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

export default function Login({
  onNavigateSignUp,
  onBackToPublic,
  onForgotPassword,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login credentials:", formData);
    alert("Logged in successfully!");
  };

  return (
    <FormCard>
      {/* Top Left: Back to Public / Home Button */}
      <div className="mb-2">
        <button
          type="button"
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:text-brand-dark-muted dark:hover:text-brand-dark-text transition-colors cursor-pointer"
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
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-normal text-gray-900 dark:text-brand-dark-text tracking-tight mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-gray-500 dark:text-brand-dark-muted">
            Log in to your ASTU MSJ account
          </p>
        </div>

        {/* Login Form */}
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
            <Button type="submit">Log In</Button>
          </div>
        </form>

        {/* Footer Navigation Links */}
        <div className="mt-8 text-center space-y-3 text-xs">
          <p className="text-gray-600 dark:text-brand-dark-muted">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="text-[#B93325] dark:text-brand-dark-accent font-semibold hover:underline cursor-pointer"
            >
              Sign up
            </button>
          </p>

          <div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#B93325] dark:text-brand-dark-accent font-medium hover:underline transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
    </FormCard>
  );
}
