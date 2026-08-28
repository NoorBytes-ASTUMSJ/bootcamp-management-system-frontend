const SERVICE_ID = "service_dnydl1r";
const TEMPLATE_ID = "template_tyv8akj";
const PUBLIC_KEY = "Tk6pBxXbnfW3diLSj";

export const sendConfirmationEmail = async ({
  recipientName,
  recipientEmail,
  role,
  track,
}) => {
  if (!recipientEmail) {
    console.warn("sendConfirmationEmail: recipientEmail is missing.");
    return false;
  }

  const payload = {
    service_id: SERVICE_ID,
    template_id: TEMPLATE_ID,
    user_id: PUBLIC_KEY,
    template_params: {
      to_email: recipientEmail.trim(),
      to_name: recipientName?.trim() || "Participant",
      role_type: role || "Student",
      track_name: track || "General Track",
      current_year: new Date().getFullYear(),
      announcement_link:
        "https://bootcamp-management-system-frontend.vercel.app/announcements",
    },
  };

  console.log("📧 Sending registration email...");
  console.log("📧 Email:", recipientEmail);
  console.log("📧 Role:", role);
  console.log("📧 Track:", track);

  try {
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const responseText = await response.text();

    console.log("📧 EmailJS Status:", response.status);
    console.log("📧 EmailJS Response:", responseText);

    if (!response.ok) {
      console.error("❌ EmailJS failed:", response.status, responseText);
      return false;
    }

    console.log("✅ Registration email sent successfully!");

    return true;
  } catch (error) {
    console.error("❌ EmailJS network error:", error);
    return false;
  }
};
