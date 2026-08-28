import API from "./api";

const DEFAULT_USER_PROFILE = {
  fullName: "User",
  email: "",
  phone: "",
  gender: "Male",
  academicYear: "3rd Year",
  department: "Computer Science and Engineering",
  bio: "",
  role: "User",
  accountStatus: "Active",
  joinedDate: "N/A",
  lastLogin: "N/A",
  userId: "",
  avatarUrl: null,
};

/**
 * Logged-in የተጠቃሚውን መረጃ ከ /api/users/me ያመጣል
 */
export async function getUserProfile() {
  try {
    const response = await API.get("/users/me");
    if (response.data && response.data.data) {
      const userData = response.data.data.user || response.data.data;
      return { ...DEFAULT_USER_PROFILE, ...userData };
    }
  } catch (err) {
    console.warn(
      "Could not fetch profile from server, using local fallback.",
      err.message,
    );
  }

  // Fallback to local storage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      return { ...DEFAULT_USER_PROFILE, ...parsed };
    } catch {
      // ignore parse errors
    }
  }

  return DEFAULT_USER_PROFILE;
}

/**
 * የተጠቃሚውን Profile መረጃ በ PATCH /api/users/me ያድሳል
 */
export async function updateUserProfile(payload) {
  try {
    const response = await API.patch("/users/me", payload);
    const updatedUser =
      response.data?.data?.user || response.data?.data || payload;

    // የሎካል ዳታውን አዘምን
    const stored = localStorage.getItem("user");
    const base = stored ? JSON.parse(stored) : {};
    localStorage.setItem("user", JSON.stringify({ ...base, ...updatedUser }));

    return { success: true, data: updatedUser };
  } catch (err) {
    console.error("Profile update failed:", err);
    throw err;
  }
}

/**
 * የይለፍ ቃል በ PATCH /api/users/me/password ይቀይራል
 */
export async function changeUserPassword({ currentPassword, newPassword }) {
  try {
    const response = await API.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (err) {
    console.error("Password change failed:", err);
    throw err;
  }
}
