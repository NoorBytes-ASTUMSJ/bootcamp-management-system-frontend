import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import { Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function Login({
  onNavigateSignUp,
  onBackToPublic,
  onForgotPassword,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      const responseData = response.data.data || response.data;
      const { user, token } = responseData;

      login(user, token);

      const targetPath = getRedirectPath
        ? getRedirectPath(user.role)
        : "/announcements";
      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputWithIconStyle =
    "w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs cursor-text";

  const primaryBtnStyle =
    "w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-primary-foreground text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer disabled:opacity-60 text-center flex items-center justify-center select-none";

  return (
    <FormCard>
      <div className="w-full">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={onBackToPublic || (() => navigate("/"))}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50 select-none"
          >
            <ArrowLeft size={14} />
            <span>Back to home</span>
          </button>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase border border-primary/20">
            Account Portal
          </span>
        </div>

        {/* Brand Logo & Heading */}
        <div className="text-center mb-5 pt-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border/80 shadow-xs p-1 mb-2.5 overflow-hidden">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Log in to manage your bootcamp registration and tracks.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 text-xs font-medium text-red-500 bg-red-500/10 rounded-xl border border-red-500/25 flex items-center gap-2 animate-in fade-in duration-200">
            <span className="font-bold">✕</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
              Email Address <span className="text-primary">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail
                size={16}
                className="absolute left-3.5 text-text-muted pointer-events-none"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputWithIconStyle}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase">
                Password <span className="text-primary">*</span>
              </label>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock
                size={15}
                className="absolute left-3.5 text-text-muted pointer-events-none"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className={inputWithIconStyle}
              />
              {/* Press & Hold Eye Button */}
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
                className="absolute right-3.5 text-text-muted hover:text-primary transition-colors cursor-pointer select-none"
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={primaryBtnStyle}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Logging in...</span>
                </span>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted mt-5">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="text-primary font-bold hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </p>
      </div>
    </FormCard>
  );
}
