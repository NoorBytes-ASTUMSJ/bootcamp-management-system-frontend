import { useState } from "react";
import FormCard from "../ui/FormCard";
import Stepper from "../ui/Stepper";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import Button from "../ui/Button";
import { Link2, Code, Terminal, Clock } from "lucide-react";

export default function StudentRegister() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Form State
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
    2: "Academic",
    3: "Commitment",
  };

  return (
    <FormCard>
      {/* Top Stepper Indicator */}
      <Stepper
        currentStep={step}
        totalSteps={totalSteps}
        stepTitle={stepTitles[step]}
      />

      <form onSubmit={step === totalSteps ? handleSubmit : handleNext}>
        {/* ================= STEP 1: PERSONAL INFORMATION ================= */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-brand-dark-text mb-6">
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

            <p className="text-center text-xs text-gray-500 dark:text-brand-dark-muted mt-6">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-brand dark:text-brand-dark-accent font-medium hover:underline"
              >
                Log In
              </a>
            </p>
          </div>
        )}

        {/* ================= STEP 2: ACADEMIC & TECH ================= */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-brand-dark-text mb-2">
              Academic & Tech
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-brand-dark-muted mb-6">
              Provide your academic details and technical profiles to help us
              tailor the bootcamp experience.
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
            <div className="border-t border-gray-100 dark:border-brand-dark-border pt-4 mt-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-brand-dark-text">
                <Terminal size={14} className="text-gray-500" />
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
            <div className="flex items-center gap-3 mt-6">
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
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-brand-dark-text mb-2">
              Final Commitment Details
            </h2>
            <p className="text-xs text-center text-gray-500 dark:text-brand-dark-muted mb-6">
              Almost done. Please provide your availability and motivation for
              joining the bootcamp.
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
            <p className="text-[11px] text-gray-400 dark:text-brand-dark-muted -mt-2.5 mb-4">
              How many hours can you dedicate to the bootcamp daily?
            </p>

            <div className="w-full mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-brand-dark-text mb-1.5">
                Availability Description
              </label>
              <textarea
                name="availability"
                rows={3}
                value={formData.availability}
                onChange={handleChange}
                placeholder="Please describe your general availability (e.g., evenings, weekends, any specific constraints)."
                className="w-full bg-white dark:bg-brand-dark-surface border border-gray-200 dark:border-brand-dark-border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-brand-dark-text placeholder:text-gray-400 dark:placeholder:text-brand-dark-muted/60 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all resize-none"
                required
              />
            </div>

            <div className="w-full mb-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-brand-dark-text mb-1.5">
                Motivation
              </label>
              <textarea
                name="motivation"
                rows={3}
                value={formData.motivation}
                onChange={handleChange}
                placeholder="Why do you want to join the ASTU MSJ Bootcamp? What do you hope to achieve?"
                className="w-full bg-white dark:bg-brand-dark-surface border border-gray-200 dark:border-brand-dark-border rounded-lg px-3.5 py-2.5 text-sm text-gray-900 dark:text-brand-dark-text placeholder:text-gray-400 dark:placeholder:text-brand-dark-muted/60 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all resize-none"
                required
              />
            </div>

            {/* Submit Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={handlePrev}>
                Previous
              </Button>
              <Button type="submit">Submit</Button>
            </div>
          </div>
        )}
      </form>
    </FormCard>
  );
}
