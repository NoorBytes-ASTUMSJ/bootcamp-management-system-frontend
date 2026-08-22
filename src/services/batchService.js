const INITIAL_BATCHES_DATA = [
  {
    id: "1",
    name: "Batch #25 - Winter 2024",
    track: "Full-Stack Web Development",
    status: "Active",
    currentStudents: 42,
    capacity: 50,
    startDate: "Jan 15, 2024",
    endDate: "Apr 20, 2024",
    timeline: "Jan 15 - Apr 20, 2024",
    progress: 72,
  },
  {
    id: "2",
    name: "Batch #26 - Spring 2024",
    track: "Full-Stack Web Development",
    status: "Upcoming",
    currentStudents: 12,
    capacity: 50,
    startDate: "May 01, 2024",
    endDate: "Aug 10, 2024",
    timeline: "May 01 - Aug 10, 2024",
    progress: 0,
  },
  {
    id: "3",
    name: "Batch #24 - Fall 2023",
    track: "Full-Stack Web Development",
    status: "Completed",
    currentStudents: 48,
    capacity: 50,
    startDate: "Sep 10, 2023",
    endDate: "Dec 15, 2023",
    timeline: "Sep 10 - Dec 15, 2023",
    progress: 100,
  },
];

export async function getBatches() {
  try {
    const response = await fetch("/api/v1/batches");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return Array.isArray(data) ? data : data.batches || INITIAL_BATCHES_DATA;
    }
  } catch (err) {
    console.info(
      "Backend batch service unreachable. Loaded standard mock records.",
    );
  }
  return INITIAL_BATCHES_DATA;
}
