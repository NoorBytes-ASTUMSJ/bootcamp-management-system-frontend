import API from "./api";
const mapBatchToUI = (batch) => {
  if (!batch) return null;

  const statusMap = {
    ongoing: "Active",
    upcoming: "Upcoming",
    completed: "Completed",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formattedStart = formatDate(batch.startDate);
  const formattedEnd = formatDate(batch.endDate);

  // Calculate percentage elapsed for progress bar
  let progress = 0;
  if (batch.startDate && batch.endDate) {
    const start = new Date(batch.startDate).getTime();
    const end = new Date(batch.endDate).getTime();
    const now = Date.now();

    if (now >= end) {
      progress = 100;
    } else if (now > start && end > start) {
      progress = Math.round(((now - start) / (end - start)) * 100);
    }
  }

  const studentCount = batch.studentCount || 0;

  return {
    ...batch,
    id: batch._id,
    status: statusMap[batch.status] || "Upcoming",
    currentStudents: studentCount,
    capacity: Math.max(studentCount, 50), // Standard capacity threshold
    startDate: formattedStart,
    endDate: formattedEnd,
    timeline: `${formattedStart} - ${formattedEnd}`,
    progress,
    track: batch.description || "Bootcamp Training Program",
  };
};

export async function getBatches() {
  try {
    const response = await API.get("/batches");
    const rawBatches = response.data?.data?.batches || [];
    return rawBatches.map(mapBatchToUI);
  } catch (err) {
    console.error("Failed to fetch batches:", err);
    return [];
  }
}

export async function getBatchStats() {
  try {
    const response = await API.get("/batches/stats");
    return (
      response.data?.data?.stats || {
        totalBatches: 0,
        activeBatches: 0,
        totalStudents: 0,
        totalMentors: 0,
      }
    );
  } catch (err) {
    console.error("Failed to fetch batch dashboard stats:", err);
    return {
      totalBatches: 0,
      activeBatches: 0,
      totalStudents: 0,
      totalMentors: 0,
    };
  }
}
// Add/Create new batch
export async function createBatch(batchData) {
  try {
    const response = await API.post("/batches", batchData);
    return response.data?.data?.batch || response.data;
  } catch (err) {
    console.error("Failed to create batch:", err);
    throw err;
  }
}

// Update existing batch
export async function updateBatch(batchId, batchData) {
  try {
    const response = await API.patch(`/batches/${batchId}`, batchData);
    return response.data?.data?.batch || response.data;
  } catch (err) {
    console.error("Failed to update batch:", err);
    throw err;
  }
}