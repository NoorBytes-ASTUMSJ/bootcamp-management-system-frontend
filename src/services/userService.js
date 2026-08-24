import API from "./api";

export async function getAllUsers(filters = {}) {
  try {
    const params = {};

    if (filters.search) {
      params.search = filters.search;
    }

    if (filters.status && filters.status !== "ALL") {
      params.status = filters.status;
    }

    if (filters.role && filters.role !== "ALL") {
      params.role = filters.role;
    }

    if (filters.university && filters.university !== "ALL") {
      params.university = filters.university;
    }

    if (filters.gender && filters.gender !== "ALL") {
      params.gender = filters.gender;
    }

    if (filters.batch && filters.batch !== "ALL") {
      params.batch = filters.batch;
    }

    const response = await API.get("/users", { params });
    const resData = response.data;

    return resData.data?.users || resData.users || [];
  } catch (err) {
    console.error("Error fetching users from API:", err);
    return [];
  }
}

export async function deleteUserApi(userId) {
  const response = await API.delete(`/users/${userId}`);
  return response.data;
}

