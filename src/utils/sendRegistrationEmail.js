import emailjs from "@emailjs/browser";

export const sendConfirmationEmail = async ({
  recipientName,
  recipientEmail,
  role, // "Student" or "Mentor"
  track, // "Full-Stack Development", "Competitive Programming", etc.
}) => {
  const SERVICE_ID = "service_dnydl1r";
  const TEMPLATE_ID = "template_tyv8akj";
  const PUBLIC_KEY = "Tk6pBxXbnfW3diLSj";

  const templateParams = {
    to_name: recipientName,
    to_email: recipientEmail,
    role_type: role,
    track_name: track || "General Track",
    current_year: new Date().getFullYear(),
    announcement_link: `${window.location.origin}/announcements`,
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY,
    );
    console.log("Registration email sent successfully:", response.status);
    return true;
  } catch (error) {
    console.error("Failed to send registration email:", error);
    return false;
  }
};
