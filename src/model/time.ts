import type { Time } from ".";

export function timeToNumber(time: Time): number {
  let actualHour = time.hour
  // 0 is 24, 1 is 25, 2 is 26
  if (time.hour < 6) {
    actualHour += 24;
  }
  const tenMinutePart = Math.floor(time.minute / 10);
  const minute = Math.floor(tenMinutePart * 100 / 6)
  return actualHour * 100 + minute;
}

export function timeToString(time: Time): string {
  const hour = time.hour % 12 || 12; // Convert to 12-hour format
  const minute = time.minute.toString().padStart(2, '0'); // Ensure two digits
  return `${hour}:${minute} ${time.hour < 12 ? 'AM' : 'PM'}`;
}

export function numberToTime(number: number): Time {
  const hour = Math.floor(number / 100);
  const tenMinuteRaw = Math.round(0.6*(number/10 % 10));
  const minute = 10 * tenMinuteRaw;
  return {
    hour: hour >= 24 ? hour - 24 : hour,
    minute: minute
  };
}