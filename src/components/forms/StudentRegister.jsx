import { useState } from "react";
<<<<<<< HEAD
import FormCard from "../common/FormCard";
import Stepper from "../common/Stepper";
import InputField from "./InputField";
import SelectField from "./SelectField";
import Button from "../common/Button";
import {
  Link2,
  Code,
  Terminal,
  Clock,
  Phone,
  AtSign,
  GraduationCap,
  Building2,
} from "lucide-react";
=======
import { useNavigate } from "react-router-dom";
import FormCard from "../common/FormCard";
import Stepper from "../common/Stepper";
import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";
import Button from "../common/Button";
import { Link2, Code, Terminal, Clock, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function StudentRegister({
  onNavigateLogin,
  onBackToHome,
  onNavigateAnnouncements,
}) {
  const navigate = useNavigate();
  const { login, getRedirectPath } = useAuth();
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
<<<<<<< HEAD
    // Step 1: Personal Information
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
<<<<<<< HEAD

    // Step 2: Academic & Tech
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
    gender: "",
    year: "",
    department: "",
<<<<<<< HEAD
    githubUrl: "",
    codeforcesUrl: "",
    leetcodeUrl: "",

    // Step 3: Commitment
    dailyHours: "",
    availability: "",
=======
    github: "",
    codeforces: "",
    leetcode: "",
    dailyAvailableHours: "",
    availabilityDescription: "",
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
    motivation: "",

    // Step 4: Contact & Identification
    university: "Adama Science and Technology University",
    studentId: "",
    phone: "",
    telegramUsername: "",
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

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: "user",
      applicationType: "student",
      gender: formData.gender,
      year: formData.year,
      department: formData.department,
      github: formData.github,
      codeforces: formData.codeforces,
      leetcode: formData.leetcode,
      dailyAvailableHours: Number(formData.dailyAvailableHours),
      availabilityDescription: formData.availabilityDescription,
      motivation: formData.motivation,
    };

    try {
      const response = await API.post("/auth/register/student", payload);

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
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = {
    1: "Personal Information",
    2: "Academic & Tech",
    3: "Commitment",
    4: "Contact & Identification",
  };

  return (
    <FormCard>
      <div>
        <div className="mb-2">
          <button
            type="button"
<<<<<<< HEAD
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-inherit transition-colors cursor-pointer"
=======
            onClick={onBackToHome || (() => navigate("/"))}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer disabled:opacity-50"
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
            Back to selection
          </button>
        </div>

        <Stepper
          currentStep={step}
          totalSteps={totalSteps}
          stepTitle={stepTitles[step]}
        />

        <form onSubmit={handleSubmit} className="mt-4">
          {error && (
            <div className="mb-4 p-2.5 text-xs font-medium text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
              {error}
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-inherit mb-4">
                Student Registration
              </h2>

              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Ahmed Mohammed"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email Address"
                type="email"
                name="email"
                placeholder="ahmed@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <InputField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="mt-6">
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>

              <p className="text-center text-xs text-muted mt-5">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-primary font-medium hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-inherit mb-1">
                Academic & Tech
              </h2>
              <p className="text-xs text-center text-muted mb-5">
                Provide your academic details and technical profiles.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SelectField
                  label="Gender"
                  name="gender"
                  placeholder="Select Gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  required
                />

                <SelectField
                  label="Academic Year"
                  name="year"
                  placeholder="Select Year"
                  value={formData.year}
                  onChange={handleChange}
                  options={[
                    { value: "1st", label: "1st Year" },
                    { value: "2nd", label: "2nd Year" },
                    { value: "3rd", label: "3rd Year" },
                    { value: "4th", label: "4th Year" },
                    { value: "5th", label: "5th Year" },
                  ]}
                  required
                />
              </div>

              <SelectField
                label="Department"
                name="department"
                placeholder="Select Department"
                value={formData.department}
                onChange={handleChange}
                options={[
                  {
                    value: "Computer Science & Engineering",
                    label: "Computer Science & Engineering",
                  },
                  {
                    value: "Software Engineering",
                    label: "Software Engineering",
                  },
                  {
                    value: "Electrical & Computer Engineering",
                    label: "Electrical & Computer Engineering",
                  },
                  { value: "Other Engineering", label: "Other Engineering" },
                ]}
                required={formData.year !== "1st"}
              />

              <div className="border-t border-border pt-3 mt-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-inherit">
                  <Terminal size={14} className="text-muted" />
                  <span>Technical Profiles</span>
                </div>
              </div>

              <InputField
                label="GitHub URL"
                name="github"
                placeholder="https://github.com/username"
                value={formData.github}
                onChange={handleChange}
                icon={Link2}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Codeforces URL"
                  name="codeforces"
                  placeholder="https://codeforces.com/profile/username"
                  value={formData.codeforces}
                  onChange={handleChange}
                  icon={Code}
                  required
                />

                <InputField
                  label="LeetCode URL"
                  name="leetcode"
                  placeholder="https://leetcode.com/u/username"
                  value={formData.leetcode}
                  onChange={handleChange}
                  icon={Terminal}
                  required
                />
              </div>

              <div className="flex items-center gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handlePrev}>
                  Previous
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {/* ================= STEP 3: COMMITMENT ================= */}
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-inherit mb-1">
                Final Commitment Details
              </h2>
              <p className="text-xs text-center text-muted mb-5">
                Please provide your availability and motivation for joining.
              </p>

              <InputField
                label="Daily Available Hours"
                name="dailyAvailableHours"
                type="number"
                placeholder="e.g., 4"
                value={formData.dailyAvailableHours}
                onChange={handleChange}
                icon={Clock}
                required
              />
<<<<<<< HEAD
              <p className="text-[11px] text-muted -mt-2.5 mb-4">
                How many hours can you dedicate to the bootcamp daily?
              </p>
=======
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914

              <div className="w-full mb-3">
                <label className="block text-[10px] font-bold tracking-wider text-muted uppercase mb-1">
                  Availability Description
                </label>
                <textarea
                  name="availabilityDescription"
                  rows={3}
                  value={formData.availabilityDescription}
                  onChange={handleChange}
<<<<<<< HEAD
                  placeholder="Please describe your general availability (e.g., evenings, weekends)."
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-xs text-inherit placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/30 transition-colors resize-none shadow-2xs"
=======
                  placeholder="Describe your general availability (e.g., evenings, weekends)."
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none shadow-2xs"
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
                  required
                />
              </div>

              <div className="w-full mb-3">
                <label className="block text-[10px] font-bold tracking-wider text-muted uppercase mb-1">
                  Motivation
                </label>
                <textarea
                  name="motivation"
                  rows={3}
                  value={formData.motivation}
                  onChange={handleChange}
<<<<<<< HEAD
                  placeholder="Why do you want to join the ASTU MSJ Bootcamp?"
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-xs text-inherit placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary hover:border-primary/30 transition-colors resize-none shadow-2xs"
=======
                  placeholder="Why do you want to join the bootcamp?"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none shadow-2xs"
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
                  required
                />
              </div>

              <div className="flex items-center gap-4 mt-6">
<<<<<<< HEAD
                <Button type="button" variant="outline" onClick={handlePrev}>
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: CONTACT & IDENTIFICATION (ONE PER ROW) ================= */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-inherit mb-1">
                Contact & Identification
              </h2>
              <p className="text-xs text-center text-muted mb-5">
                Provide your institutional identification and contact details.
              </p>

              <div className="space-y-3">
                {/* 1. University */}
                <InputField
                  label="University"
                  name="university"
                  placeholder="Adama Science and Technology University"
                  value={formData.university}
                  onChange={handleChange}
                  icon={Building2}
                  required
                />

                {/* 2. Student ID */}
                <InputField
                  label="Student ID"
                  name="studentId"
                  placeholder="e.g., UGR/12345/14"
                  value={formData.studentId}
                  onChange={handleChange}
                  icon={GraduationCap}
                  required
                />

                {/* 3. Phone Number */}
                <InputField
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  placeholder="+251 900 000-000"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Phone}
                  required
                />

                {/* 4. Telegram Username */}
                <InputField
                  label="Telegram Username"
                  name="telegramUsername"
                  placeholder="@username"
                  value={formData.telegramUsername}
                  onChange={handleChange}
                  icon={AtSign}
                  required
                />
              </div>

              <div className="flex items-center gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handlePrev}>
=======
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrev}
                  disabled={loading}
                >
>>>>>>> 27d492b4e1fef52818f4ac14ab1ed0e3ead2c914
                  Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} />{" "}
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormCard>
  );
}
