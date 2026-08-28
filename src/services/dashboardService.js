import API from "./api"; // Your configured axios instance

export async function fetchDashboardOverview() {
  try {
    const response = await API.get("/dashboard/overview");
    // Handles both { success: true, data: { ... } } and direct responses
    const resData = response.data;
    return resData.success ? resData.data : resData;
  } catch (err) {
    console.error("Failed to load dashboard overview from API:", err);
    throw err;
  }
}