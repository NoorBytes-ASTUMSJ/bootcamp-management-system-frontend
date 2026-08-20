import { useState } from "react";
import FormCard from "../common/FormCard";
import Stepper from "../common/Stepper";
import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";
import Button from "../common/Button";
import { Link2, Code, Terminal, Clock } from "lucide-react";

export default function StudentRegister({ onNavigateLogin, onBackToHome }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2
    gender: "",
    academicYear: "",
    department: "",
    githubUrl: "",
    codeforcesUrl: "",
    leetcodeUrl: "",
    // Step 3
    dailyHours: "",
    availability: "",
    motivation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < totalSteps) setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Registration Data Submitted:", formData);
    alert("Application submitted successfully!");
  };

  const stepTitles = {
    1: "Personal Information",
    2: "Academic & Tech",
    3: "Commitment",
  };

  return (
    <FormCard>
      <div>
        {/* Top Left: Back to selection */}
        <div className="mb-2">
          <button
            type="button"
            onClick={onBackToHome}
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
            Back to selection
          </button>
        </div>

        {/* Top Stepper Indicator */}
        <Stepper
          currentStep={step}
          totalSteps={totalSteps}
          stepTitle={stepTitles[step]}
        />

        <form
          onSubmit={step === totalSteps ? handleSubmit : handleNext}
          className="mt-4"
        >
          {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-text-primary mb-4">
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
                label="Phone Number"
                type="tel"
                name="phone"
                placeholder="+251 900 000-000"
                value={formData.phone}
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
                <Button type="submit">Next</Button>
              </div>

              <p className="text-center text-xs text-text-muted mt-5">
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

          {/* ================= STEP 2: ACADEMIC & TECH ================= */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-text-primary mb-1">
                Academic & Tech
              </h2>
              <p className="text-xs text-center text-text-muted mb-5">
                Provide your academic details and technical profiles.
              </p>

              {/* Gender & Academic Year side-by-side */}
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
                  name="academicYear"
                  placeholder="Select Year"
                  value={formData.academicYear}
                  onChange={handleChange}
                  options={[
                    { value: "1st", label: "1st Year" },
                    { value: "2nd", label: "2nd Year" },
                    { value: "3rd", label: "3rd Year" },
                    { value: "4th", label: "4th Year" },
                    { value: "5th", label: "5th Year" },
                    { value: "graduated", label: "Graduated" },
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
                  { value: "cse", label: "Computer Science & Engineering" },
                  { value: "software", label: "Software Engineering" },
                  { value: "ece", label: "Electrical & Computer Engineering" },
                  { value: "other", label: "Other Engineering" },
                ]}
                required
              />

              {/* Technical Profiles Header Divider */}
              <div className="border-t border-border pt-3 mt-2 mb-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
                  <Terminal size={14} className="text-text-muted" />
                  <span>Technical Profiles</span>
                </div>
              </div>

              <InputField
                label="GitHub URL"
                name="githubUrl"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleChange}
                icon={Link2}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Codeforces URL"
                  name="codeforcesUrl"
                  placeholder="Profile URL"
                  value={formData.codeforcesUrl}
                  onChange={handleChange}
                  icon={Code}
                />

                <InputField
                  label="LeetCode URL"
                  name="leetcodeUrl"
                  placeholder="Profile URL"
                  value={formData.leetcodeUrl}
                  onChange={handleChange}
                  icon={Terminal}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-6">
                <Button type="button" variant="secondary" onClick={handlePrev}>
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: COMMITMENT DETAILS ================= */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-center text-text-primary mb-1">
                Final Commitment Details
              </h2>
              <p className="text-xs text-center text-text-muted mb-5">
                Please provide your availability and motivation for joining.
              </p>

              <InputField
                label="Daily Available Hours"
                name="dailyHours"
                placeholder="e.g., 4"
                value={formData.dailyHours}
                onChange={handleChange}
                icon={Clock}
                required
              />
              <p className="text-[11px] text-text-muted -mt-2.5 mb-4">
                How many hours can you dedicate to the bootcamp daily?
              </p>

              <div className="w-full mb-3">
                <label className="block text-[10px] font-bold tracking-wider text-text-muted uppercase mb-1">
                  Availability Description
                </label>
                <textarea
                  name="availability"
                  rows={3}
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="Please describe your general availability (e.g., evenings, weekends)."
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none shadow-2xs"
                  required
                />
              </div>

              <div className="w-full mb-3">
                <label className="block text-[10px] font-bold tracking-wider text-text-muted uppercase mb-1">
                  Motivation
                </label>
                <textarea
                  name="motivation"
                  rows={3}
                  value={formData.motivation}
                  onChange={handleChange}
                  placeholder="Why do you want to join the ASTU MSJ Bootcamp?"
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none shadow-2xs"
                  required
                />
              </div>

              {/* Submit Actions */}
              <div className="flex items-center gap-4 mt-6">
                <Button type="button" variant="secondary" onClick={handlePrev}>
                  Previous
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </FormCard>
  );
}
