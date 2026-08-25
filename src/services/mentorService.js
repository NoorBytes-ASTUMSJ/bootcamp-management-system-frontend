import API from "./api";

export async function getMentors(filters = {}) {
  try {
    const params = {};

    if (filters.role && filters.role !== "ALL") {
      params.role = filters.role;
    }

    if (filters.university && filters.university !== "ALL") {
      params.university = filters.university;
    }

    if (filters.gender && filters.gender !== "ALL") {
      params.gender = filters.gender;
    }

    const response = await API.get("/members/staff", { params });

    const resData = response.data;

    return resData.data?.staff || resData.staff || [];
  } catch (err) {
    console.error("Error fetching staff from API:", err);
    return [];
  }
}