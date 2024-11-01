import { TimeUnit } from "../constants/time.js";

export function getDateBefore(x: number, unit: TimeUnit) {
    const currentDate = new Date();
    switch (unit) {
      case TimeUnit.Seconds:
        currentDate.setSeconds(currentDate.getSeconds() - x);
        break;
      case TimeUnit.Minutes:
        currentDate.setMinutes(currentDate.getMinutes() - x);
        break;
      case TimeUnit.Hours:
        currentDate.setHours(currentDate.getHours() - x);
        break;
      case TimeUnit.Days:
        currentDate.setDate(currentDate.getDate() - x);
        break;
      case TimeUnit.Weeks:
        currentDate.setDate(currentDate.getDate() - (x * 7));
        break;
      case TimeUnit.Months:
        currentDate.setMonth(currentDate.getMonth() - x);
        break;
      case TimeUnit.Years:
        currentDate.setFullYear(currentDate.getFullYear() - x);
        break;
      default:
        throw new Error("Invalid time unit. Use 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', or 'years'.");
    }
    return currentDate;
  }