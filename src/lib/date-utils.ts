const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ABBREVS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Returns an array of 6 Date objects starting from today */
export function getNextSixDays(): Date[] {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

/** Format a Date as "04 Apr, 2026" */
export function formatDateDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

/** Get day abbreviation: "TODAY" for index 0, else "MON"/"TUE"/etc */
export function getDayAbbreviation(date: Date, isToday: boolean): string {
  return isToday ? "TODAY" : DAY_ABBREVS[date.getDay()];
}

/** Get full day name: "Saturday", "Sunday", etc */
export function getDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

/** Check if a time slot string (e.g., "09:30 AM") is in the past for a given date */
export function isSlotInPast(date: Date, slotLabel: string): boolean {
  const now = new Date();
  const slotDate = new Date(date);
  const [time, period] = slotLabel.split(" ");
  const [hStr, mStr] = time.split(":");
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  slotDate.setHours(hours, minutes, 0, 0);
  return slotDate.getTime() < now.getTime();
}

/** Compute the end time (30 min later) for a slot label */
export function getSlotEndTime(slotLabel: string): string {
  const [time, period] = slotLabel.split(" ");
  const [hStr, mStr] = time.split(":");
  let hours = parseInt(hStr, 10);
  let minutes = parseInt(mStr, 10);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  const endPeriod = hours >= 12 ? "PM" : "AM";
  const endHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${endHours}:${String(minutes).padStart(2, "0")} ${endPeriod}`;
}
