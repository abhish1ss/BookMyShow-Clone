import { DateTime } from "luxon";

// String-in/string-out date helpers (luxon). Keep values as plain strings —
// the app's date inputs are native <input type="date/time">.

export const today = () => DateTime.now().toFormat("yyyy-MM-dd");

// Accepts an ISO string (or Date) and a luxon format, e.g. "yyyy-MM-dd"
export const formatDate = (value, fmt = "yyyy-MM-dd") => {
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(value);
  return dt.isValid ? dt.toFormat(fmt) : "";
};

const ordinal = (day) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

// moment's "MMM Do YYYY" (e.g. "Jul 1st 2026") — luxon has no ordinal token
export const formatShowDate = (value) => {
  const dt =
    value instanceof Date
      ? DateTime.fromJSDate(value)
      : DateTime.fromISO(value);
  if (!dt.isValid) return "";
  return `${dt.toFormat("MMM")} ${ordinal(dt.day)} ${dt.toFormat("yyyy")}`;
};

// "HH:mm" (24h) -> "hh:mm AM/PM"
export const formatTime = (hhmm) => {
  const dt = DateTime.fromFormat(hhmm || "", "HH:mm");
  return dt.isValid ? dt.toFormat("hh:mm a").toUpperCase() : "";
};

// zero-padded 24h "HH:mm" strings sort correctly as plain strings
export const compareTimes = (a, b) => (a || "").localeCompare(b || "");
