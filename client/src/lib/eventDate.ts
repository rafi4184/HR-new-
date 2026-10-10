// A pinned/featured event with a future date is promotional (an upcoming
// summit, award, enrollment deadline) rather than a past success story —
// used to swap in an "Upcoming" badge instead of treating it as recap news.
export function isUpcoming(eventDate: string | null): boolean {
  if (!eventDate) return false;
  const d = new Date(eventDate);
  d.setHours(23, 59, 59, 999);
  return d.getTime() >= Date.now();
}
