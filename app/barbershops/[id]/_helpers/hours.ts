import { setHours, setMinutes, format, addMinutes, isAfter } from "date-fns";

export function generateDayTimeList(date: Date): string[] {

  const startTime = setMinutes(setHours(date, 9), 0); // Set start time to 09:00
  const endTime = setMinutes(setHours(date, 21), 0); // Set end time to 21:00
  const interval = 30; // interval in minutes
  const timeList: string[] = [];

  const now = new Date();
  let currentTime = startTime;

  while (currentTime <= endTime) {

    if (isAfter(currentTime, now)) {
      timeList.push(format(currentTime, "HH:mm"));
    }

    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}
