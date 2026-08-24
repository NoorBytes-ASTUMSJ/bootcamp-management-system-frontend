import API from "./api";

export async function getStudents(filters = {}) {
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

    const response = await API.get("/members/students", { params });

    const resData = response.data;

    return resData.data?.students || resData.students || [];
  } catch (err) {
    console.error("Error fetching students from API:", err);
    return [];
  }
}