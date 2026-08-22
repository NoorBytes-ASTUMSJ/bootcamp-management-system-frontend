const INITIAL_ANNOUNCEMENTS_DATA = [
  {
    id: "1",
    title: "Registration Deadline",
    audience: "Everyone",
    batch: "ALL",
    batchName: "All Batches",
    publishedDate: "Oct 12, 2026",
    status: "Published",
    content:
      "Final reminder: All applicant profiles must be completed before the system deadline.",
  },
  {
    id: "2",
    title: "Interview Schedule",
    audience: "Students",
    batch: "1st",
    batchName: "1st Batch",
    publishedDate: "Oct 15, 2026",
    status: "Published",
    content:
      "Technical interview timeslots have been distributed to all candidates via email.",
  },
  {
    id: "3",
    title: "First Qualification Results",
    audience: "Students",
    batch: "1st",
    batchName: "1st Batch",
    publishedDate: "Oct 20, 2026",
    status: "Draft",
    content:
      "Draft results for the round 1 algorithmic evaluation. Review pending mentor sign-off.",
  },
  {
    id: "4",
    title: "Final Selection Results",
    audience: "Everyone",
    batch: "ALL",
    batchName: "All Batches",
    publishedDate: "Oct 25, 2026",
    status: "Published",
    content:
      "Congratulations to all accepted candidates across ASTU and partner institutions.",
  },
];

export async function getAnnouncements() {
  try {
    const response = await fetch("/api/v1/communication/announcements");
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      const data = await response.json();
      return Array.isArray(data)
        ? data
        : data.announcements || INITIAL_ANNOUNCEMENTS_DATA;
    }
  } catch (err) {
    console.info("Announcements API offline. Loaded standard mock dataset.");
  }
  return INITIAL_ANNOUNCEMENTS_DATA;
}
