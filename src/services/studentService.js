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

// Specifically for STUDENTS viewing their batch
export async function getMyBatchMembers(filter = "all") {
  try {
    const response = await API.get("/members/student/my-batch", {
      params: { filter },
    });

    const resData = response.data;
    return resData.data?.members || resData.members || [];
  } catch (err) {
    console.error("Error fetching student batch members:", err);
    throw err;
  }
}

// Specifically for MENTORS viewing their batch/assigned students
export async function getMentorBatchMembers() {
  try {
    const response = await API.get("/members/mentor/my-batch");

    const resData = response.data;
    return resData.data?.members || resData.members || [];
  } catch (err) {
    console.error("Error fetching mentor batch members:", err);
    throw err;
  }
}

export async function getMyStudentDetail(studentUserId) {
  try {
    if (!studentUserId) {
      throw new Error("Student user ID is required.");
    }

    const response = await API.get(
      `/members/mentor/student/${studentUserId}`,
    );

    const resData = response.data;

    return resData.data?.student || resData.student || null;
  } catch (err) {
    console.error("Error fetching student details:", err);
    throw err;
  }
}
export async function getMyStudents() {
  try {
    const response = await API.get("/members/mentor/my-batch", {
      params: {
        filter: "my-students",
      },
    });

    const resData = response.data;

    return resData.data?.members || resData.members || [];
  } catch (err) {
    console.error("Error fetching my students:", err);
    throw err;
  }
}