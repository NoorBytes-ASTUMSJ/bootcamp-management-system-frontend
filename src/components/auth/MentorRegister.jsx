import { useState } from "react";
import FormCard from "../ui/FormCard";
import Stepper from "../ui/Stepper";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import RadioGroup from "../ui/RadioGroup";
import TextareaField from "../ui/TextareaField";
import Button from "../ui/Button";

export default function MentorRegister({ onNavigateLogin, onBackToHome }) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1: Personal & Auth
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2: Academic Details
    gender: "male",
    academicYear: "",
    department: "",
    // Step 3: Expertise & Background
    mentorshipTrack: "",
    relevantExperience: "",
    motivation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (val) => {
    setFormData((prev) => ({ ...prev, gender: val }));
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
    console.log("Mentor Application Submitted:", formData);
    alert("Mentor Application submitted successfully!");
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Personal & Auth";
      case 2:
        return "Academic Details";
      case 3:
        return "Expertise & Background";
      default:
        return "";
    }
  };

  return (
    <FormCard>
      <div>
        {/* Top Left: Back to selection */}
        <div className="mb-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-theme-muted hover:text-theme-text transition-colors cursor-pointer"
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

        <h2 className="text-2xl font-bold text-center text-theme-text mb-2">
          Mentor Application
        </h2>

        <Stepper
          currentStep={step}
          totalSteps={totalSteps}
          stepTitle={getStepTitle()}
        />

        <form
          onSubmit={step === totalSteps ? handleSubmit : handleNext}
          className="mt-4"
        >
          {/* ================= STEP 1: PERSONAL & AUTH ================= */}
          {step === 1 && (
            <div>
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Ahmed Mohammed"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email"
                type="email"
                name="email"
                placeholder="ahmed@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Phone"
                type="tel"
                name="phone"
                placeholder="+251 900 000 000"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              </div>

              <div className="mt-5">
                <Button type="submit">Next</Button>
              </div>

              <p className="text-center text-xs text-theme-muted mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateLogin}
                  className="text-[#B93325] font-medium hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          )}

          {/* ================= STEP 2: ACADEMIC DETAILS ================= */}
          {step === 2 && (
            <div>
              <RadioGroup
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleGenderChange}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
              />

              <SelectField
                label="Academic Year"
                name="academicYear"
                placeholder="Select your current year"
                value={formData.academicYear}
                onChange={handleChange}
                options={[
                  { value: "2nd", label: "2nd Year" },
                  { value: "3rd", label: "3rd Year" },
                  { value: "4th", label: "4th Year" },
                  { value: "5th", label: "5th Year" },
                  { value: "graduated", label: "Graduated / Alumni" },
                ]}
                required
              />

              <div>
                <InputField
                  label="Department"
                  name="department"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
                <p className="text-[11px] text-theme-muted -mt-2 mb-4">
                  Required for 2nd year and above.
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8">
                <Button type="button" variant="secondary" onClick={handlePrev}>
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: EXPERTISE & BACKGROUND ================= */}
          {step === 3 && (
            <div>
              <SelectField
                label="Mentorship Track"
                name="mentorshipTrack"
                placeholder="Select your area of expertise"
                value={formData.mentorshipTrack}
                onChange={handleChange}
                options={[
                  {
                    value: "dsa",
                    label: "Data Structures & Algorithms (DSA)",
                  },
                  {
                    value: "dev",
                    label: "Software Development (Web/Mobile)",
                  },
                ]}
                required
              />

              <TextareaField
                label="Relevant Experience"
                name="relevantExperience"
                placeholder="Briefly describe your previous projects, internships, or teaching experience relevant to your chosen track."
                value={formData.relevantExperience}
                onChange={handleChange}
                rows={3}
                required
              />

              <TextareaField
                label="Why do you want to mentor?"
                name="motivation"
                placeholder="What motivates you to help junior students in this bootcamp?"
                value={formData.motivation}
                onChange={handleChange}
                rows={3}
                required
              />

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
