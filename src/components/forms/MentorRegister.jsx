import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import Stepper from "../common/Stepper";
import RegistrationClosedCard from "../common/RegistrationClosedCard";
import { subscribeToRegistrationStatus } from "../../services/firebase";
import {
  ArrowLeft,
  Phone,
  IdCard,
  Building2,
  Send,
  User,
  Mail,
  Lock,
  Loader2,
  BookOpen,
  Briefcase,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { sendConfirmationEmail } from "../../utils/sendRegistrationEmail";
import jemeaLogo from "../../assets/jemea-logo.jpg";

export default function MentorRegister({
  onNavigateLogin,
  onBackToHome,
  onNavigateAnnouncements,
}) {
  const navigate = useNavigate();
  const { login, getRedirectPath } = useAuth();

  const [isOpen, setIsOpen] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Toggle visibility states for password fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Real-time Global Registration Status Listener
  useEffect(() => {
    const unsubscribe = subscribeToRegistrationStatus((data) => {
      if (data.isMentorRegOpen !== undefined) {
        setIsOpen(data.isMentorRegOpen);
      }
      setCheckingStatus(false);
    });
    return () => unsubscribe();
  }, []);

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    academicYear: "",
    department: "",
    customDepartment: "",
    mentorshipTrack: "",
    phone: "",
    studentId: "",
    universityName: "Adama Science and Technology University",
    telegramUsername: "",
    relevantExperience: "",
    motivation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    const form = e.currentTarget.closest("form");
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (step === 1 && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      step === 2 &&
      formData.department === "Other Engineering" &&
      !formData.customDepartment.trim()
    ) {
      setError("Please specify your engineering department.");
      return;
    }

    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setError("");
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const finalDepartment =
      formData.department === "Other Engineering"
        ? formData.customDepartment.trim()
        : formData.department;

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      studentId: formData.studentId,
      universityName: formData.universityName,
      telegramUsername: formData.telegramUsername,
      password: formData.password,
      role: "user",
      applicationType: "mentor",
      gender: formData.gender,
      year: formData.academicYear,
      department: finalDepartment,
      expertise: formData.mentorshipTrack,
      experience: formData.relevantExperience,
      motivation: formData.motivation,
    };

    try {
      const response = await API.post("/auth/register/mentor", payload);

      sendConfirmationEmail({
        recipientName: formData.fullName,
        recipientEmail: formData.email,
        role: "Mentor",
        track:
          formData.mentorshipTrack === "DSA"
            ? "Data Structures & Algorithms (DSA)"
            : "Software Development",
      });

      const responseData = response.data.data || response.data;
      const { user, token } = responseData;

      if (user && token) {
        login(user, token);
        const targetPath = getRedirectPath
          ? getRedirectPath(user.role)
          : "/announcements";
        navigate(targetPath, { replace: true });
      } else {
        navigate("/announcements", { replace: true });
      }

      if (onNavigateAnnouncements) {
        onNavigateAnnouncements();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Mentor registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: "Personal Details",
    2: "Academic & Track",
    3: "ID & Contact",
    4: "Expertise & Goal",
  };

  const inputStyle =
    "w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs cursor-text";

  const inputWithIconStyle =
    "w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 hover:border-primary hover:shadow-[0_0_0_1px_rgba(234,88,12,0.25)] focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none duration-150 shadow-2xs cursor-text";

  const primaryBtnStyle =
    "w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-primary-foreground text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-primary/20 cursor-pointer disabled:opacity-60 text-center flex items-center justify-center select-none";

  const secondaryBtnStyle =
    "w-full py-2.5 px-4 rounded-xl bg-surface border border-border hover:bg-surface-subtle hover:border-primary/40 active:scale-[0.99] text-text-primary text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-60 text-center flex items-center justify-center select-none";

  // If Closed: Show Friendly Notice Card
  if (!checkingStatus && !isOpen) {
    return (
      <RegistrationClosedCard
        role="Mentor"
        onBack={onBackToHome || (() => navigate("/"))}
        onNavigateLogin={onNavigateLogin}
      />
    );
  }

  return (
    <FormCard>
      <div className="w-full">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onBackToHome || (() => navigate("/"))}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50 select-none"
          >
            <ArrowLeft size={14} />
            <span>Back to selection</span>
          </button>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase border border-primary/20">
            Mentor Track
          </span>
        </div>

        {/* Brand Logo Header */}
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-surface border border-border/80 shadow-xs p-1 overflow-hidden">
            <img
              src={jemeaLogo}
              alt="ASTU MSJ Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>

        <Stepper
          currentStep={step}
          totalSteps={totalSteps}
          stepTitle={stepTitles[step]}
        />

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col justify-between"
        >
          {error && (
            <div className="mb-4 p-3 text-xs font-medium text-red-500 bg-red-500/10 rounded-xl border border-red-500/25 flex items-center gap-2 animate-in fade-in duration-200">
              <span className="font-bold">✕</span>
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="animate-in fade-in zoom-in-98 duration-200">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  Mentor Registration
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Create your mentor authentication and basic profile.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Full Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User
                      size={16}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Ahmed Mohammed"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={inputWithIconStyle}
                    />
                  </div>
                </div>

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
                      placeholder="ahmed@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputWithIconStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                      Password <span className="text-primary">*</span>
                    </label>
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
                        className={inputWithIconStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-text-muted hover:text-primary transition-colors cursor-pointer select-none"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                      Confirm Password <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Lock
                        size={15}
                        className="absolute left-3.5 text-text-muted pointer-events-none"
                      />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={inputWithIconStyle}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 text-text-muted hover:text-primary transition-colors cursor-pointer select-none"
                      >
                        {showConfirmPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleNext}
                  className={primaryBtnStyle}
                >
                  Continue
                </button>
              </div>

              <p className="text-center text-xs text-text-muted mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-primary font-bold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in zoom-in-98 duration-200">
              <div className="text-center mb-3">
                <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  Academic & Track
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Your academic standing and area of mentorship focus.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                      Gender <span className="text-primary">*</span>
                    </label>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className={`${inputStyle} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                      Academic Standing <span className="text-primary">*</span>
                    </label>
                    <select
                      name="academicYear"
                      required
                      value={formData.academicYear}
                      onChange={handleChange}
                      className={`${inputStyle} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                      <option value="5th">5th Year</option>
                      <option value="graduated">Graduated / Alumni</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Department <span className="text-primary">*</span>
                  </label>
                  <select
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputStyle} cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select Department
                    </option>
                    <option value="Computer Science & Engineering">
                      Computer Science & Engineering
                    </option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Power & Control Engineering">
                      Power & Control Engineering
                    </option>
                    <option value="Electronics & Communication Engineering">
                      Electronics & Communication Engineering
                    </option>
                    <option value="Other Engineering">
                      Other Engineering (Specify below)
                    </option>
                  </select>
                </div>

                {formData.department === "Other Engineering" && (
                  <div className="animate-in fade-in duration-200">
                    <label className="block text-[10px] font-mono font-bold tracking-wider text-primary uppercase mb-1">
                      Specify Department Name{" "}
                      <span className="text-primary">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <BookOpen
                        size={15}
                        className="absolute left-3.5 text-primary pointer-events-none"
                      />
                      <input
                        type="text"
                        name="customDepartment"
                        required
                        placeholder="e.g. Mechanical Engineering..."
                        value={formData.customDepartment}
                        onChange={handleChange}
                        className={inputWithIconStyle}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Mentorship Track <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Briefcase
                      size={15}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <select
                      name="mentorshipTrack"
                      required
                      value={formData.mentorshipTrack}
                      onChange={handleChange}
                      className={`${inputWithIconStyle} cursor-pointer`}
                    >
                      <option value="" disabled>
                        Select Area of Expertise
                      </option>
                      <option value="DSA">
                        Data Structures & Algorithms (DSA)
                      </option>
                      <option value="Development">
                        Software Development (Web/Mobile)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={secondaryBtnStyle}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={primaryBtnStyle}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in-98 duration-200">
              <div className="text-center mb-3">
                <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  ID & Contact
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Official university identification and direct communication
                  channels.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Phone Number <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone
                      size={15}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+251 900 000-000"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputWithIconStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Student / Staff ID <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <IdCard
                      size={15}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      name="studentId"
                      required
                      placeholder="e.g. UGR/35958/16 or Staff ID"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`${inputWithIconStyle} font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    University Name <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Building2
                      size={15}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      name="universityName"
                      required
                      placeholder="Adama Science and Technology University"
                      value={formData.universityName}
                      onChange={handleChange}
                      className={inputWithIconStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Telegram Username <span className="text-primary">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Send
                      size={15}
                      className="absolute left-3.5 text-text-muted pointer-events-none"
                    />
                    <input
                      type="text"
                      name="telegramUsername"
                      required
                      placeholder="@username"
                      value={formData.telegramUsername}
                      onChange={handleChange}
                      className={inputWithIconStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={secondaryBtnStyle}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={primaryBtnStyle}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in zoom-in-98 duration-200">
              <div className="text-center mb-3">
                <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                  Expertise & Goal
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Share your technical background and mentorship availability.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Relevant Technical Experience{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="relevantExperience"
                    rows={2}
                    required
                    value={formData.relevantExperience}
                    onChange={handleChange}
                    placeholder="Briefly mention your previous projects, contest ratings, or mentoring experience."
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold tracking-wider text-text-muted uppercase mb-1">
                    Why do you want to mentor?{" "}
                    <span className="text-primary">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    rows={2}
                    required
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder="What drives you to support and guide bootcamp participants?"
                    className={`${inputStyle} resize-none`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={loading}
                  className={secondaryBtnStyle}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={primaryBtnStyle}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormCard>
  );
}
