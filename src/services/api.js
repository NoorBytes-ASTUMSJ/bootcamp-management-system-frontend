import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://noorbytes-astumsj-bootcamp-management.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// --- PASSWORD RESET API METHODS ---

/**
 * @desc Request 6-digit OTP to user's email
 */
export const requestPasswordResetOTP = async (email) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * @desc Verify OTP and reset password
 */
export const verifyOTPAndResetPassword = async ({
  email,
  otp,
  newPassword,
}) => {
  const response = await API.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

export default API;
