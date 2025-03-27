
import { addWeeks, nextFriday } from "date-fns";

// Helper to get next Friday at 10:00 AM
export const getUpcomingFriday = (): Date => {
  const today = new Date();
  const friday = nextFriday(today);
  friday.setHours(10, 0, 0, 0); // Set to 10:00 AM
  return friday;
};

// Helper to get the same date but at 11:30 AM
export const getSecondTimeSlot = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(11, 30, 0, 0); // Set to 11:30 AM
  return newDate;
};

// Helper to determine the date for a new episode based on the current episodes count
export const getNextEpisodeDate = (episodesCount: number): Date => {
  // Calculate which pair this episode belongs to (0-indexed)
  const pairIndex = Math.floor(episodesCount / 2);
  
  // Get the base Friday for this pair
  const baseFriday = getUpcomingFriday();
  
  // For first pair (0): upcoming Friday
  // For second pair (1): +2 weeks
  // For third pair (2): +4 weeks
  // For subsequent pairs: +2 weeks per pair
  const weeksToAdd = pairIndex > 0 ? pairIndex * 2 : 0;
  
  // Add the required number of weeks
  const targetDate = addWeeks(baseFriday, weeksToAdd);
  
  // If this is an odd-indexed episode (second in the pair), set time to 11:30 AM
  if (episodesCount % 2 === 1) {
    return getSecondTimeSlot(targetDate);
  }
  
  // For even-indexed episodes (first in the pair), return date at 10:00 AM
  return targetDate;
};

// Helper function to generate time options for dropdown - 30 minute intervals
export const generateTimeOptions = (): string[] => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hourFormatted = hour.toString().padStart(2, '0');
      const minuteFormatted = minute.toString().padStart(2, '0');
      options.push(`${hourFormatted}:${minuteFormatted}`);
    }
  }
  return options;
};
