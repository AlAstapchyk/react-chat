import { format, isThisYear, isToday, isYesterday } from "date-fns";

export const getFormattedDate = (date: Date) => {
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else if (isThisYear(date)) {
    return format(date, "MMMM d");
  } else {
    return format(date, "MMMM d, yyyy");
  }
};
