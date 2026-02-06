/**
 * Time Formatter Utility
 * Converts time to 12-hour format
 */

/**
 * Convert 24-hour time format to 12-hour format with AM/PM
 * @param {string} time - Time in 24-hour format (e.g., "14:30", "09:00")
 * @returns {string} Time in 12-hour format (e.g., "2:30 PM", "9:00 AM")
 */
export const formatTo12Hour = (time) => {
  if (!time) return '';
  
  // Check if already in 12-hour format (contains AM/PM)
  if (time.toUpperCase().includes('AM') || time.toUpperCase().includes('PM')) {
    return time;
  }
  
  // Parse the time string
  const [hours, minutes] = time.split(':').map(str => parseInt(str, 10));
  
  // Validate
  if (isNaN(hours) || isNaN(minutes)) {
    return time;
  }
  
  // Convert to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return `${hour12}:${formattedMinutes} ${period}`;
};

/**
 * Convert 12-hour time format to 24-hour format
 * @param {string} time - Time in 12-hour format (e.g., "2:30 PM")
 * @returns {string} Time in 24-hour format (e.g., "14:30")
 */
export const formatTo24Hour = (time) => {
  if (!time) return '';
  
  // Check if already in 24-hour format (no AM/PM)
  if (!time.toUpperCase().includes('AM') && !time.toUpperCase().includes('PM')) {
    return time;
  }
  
  const timeUpper = time.toUpperCase();
  const isPM = timeUpper.includes('PM');
  const timeWithoutPeriod = time.replace(/\s*(AM|PM|am|pm)/gi, '').trim();
  
  const [hours, minutes] = timeWithoutPeriod.split(':').map(str => parseInt(str, 10));
  
  // Validate
  if (isNaN(hours) || isNaN(minutes)) {
    return time;
  }
  
  let hour24 = hours;
  
  if (isPM && hours !== 12) {
    hour24 = hours + 12;
  } else if (!isPM && hours === 12) {
    hour24 = 0;
  }
  
  return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};
