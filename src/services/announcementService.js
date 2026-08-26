import API from "./api";

// Calls GET /api/announcements (or GET /api/announcements/dashboard)
export async function getDashboardAnnouncements() {
  try {
    const response = await API.get("/announcements"); // Now matches router.get("/")
    const resData = response.data;
    return resData.data?.announcements || resData.announcements || resData || [];
  } catch (err) {
    console.error("Error fetching announcements:", err);
    throw err;
  }
}

// Calls GET /api/announcements/feed (student / logged-in read-only feed)
export async function getUserFeedAnnouncements() {
  try {
    const response = await API.get("/announcements/feed");
    const resData = response.data;
    return resData.data?.announcements || resData.announcements || resData || [];
  } catch (err) {
    console.error("Error fetching announcement feed:", err);
    throw err;
  }
}

// Calls GET /api/announcements/public (no login required, public audience only)
export async function getPublicAnnouncements() {
  try {
    const response = await API.get("/announcements/public");
    const resData = response.data;
    return resData.data?.announcements || resData.announcements || resData || [];
  } catch (err) {
    console.error("Error fetching public announcements:", err);
    throw err;
  }
}

// Calls POST /api/announcements
export async function createAnnouncement(announcementData) {
  try {
    const response = await API.post("/announcements", announcementData);
    const resData = response.data;
    return resData.data?.announcement || resData.announcement || resData;
  } catch (err) {
    console.error("Error creating announcement:", err);
    throw err;
  }
}

export async function updateAnnouncement(id, announcementData) {
  try {
    // Note: Your backend uses router.patch, make sure your service uses API.patch or API.put if you changed it
    const response = await API.patch(`/announcements/${id}`, announcementData);
    const resData = response.data;
    return resData.data?.announcement || resData.announcement || resData;
  } catch (err) {
    console.error("Error updating announcement:", err);
    throw err;
  }
}

export async function deleteAnnouncement(id) {
  try {
    const response = await API.delete(`/announcements/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error deleting announcement:", err);
    throw err;
  }
}