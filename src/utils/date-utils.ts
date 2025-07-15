import {
  format,
  parseISO,
  isValid,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  addDays,
  addMonths,
  addYears,
  isWeekend,
  isToday,
  isSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  getDay,
  getMonth,
  getYear,
  getQuarter
} from 'date-fns';

// Format date with default format
export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, formatStr);
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | string): number => {
  if (!dateOfBirth) return 0;
  
  const parsedDate = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
  
  if (!isValid(parsedDate)) return 0;
  
  return differenceInYears(new Date(), parsedDate);
};

// Calculate tenure (years and months)
export const calculateTenure = (joinDate: Date | string): { years: number; months: number } => {
  if (!joinDate) return { years: 0, months: 0 };
  
  const parsedDate = typeof joinDate === 'string' ? parseISO(joinDate) : joinDate;
  
  if (!isValid(parsedDate)) return { years: 0, months: 0 };
  
  const now = new Date();
  const years = differenceInYears(now, parsedDate);
  const months = differenceInMonths(now, parsedDate) % 12;
  
  return { years, months };
};

// Format tenure as string
export const formatTenure = (joinDate: Date | string): string => {
  const { years, months } = calculateTenure(joinDate);
  
  if (years === 0 && months === 0) return 'Less than a month';
  if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
  if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  
  return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
};

// Calculate working days between two dates (excluding weekends)
export const calculateWorkingDays = (startDate: Date | string, endDate: Date | string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  if (!isValid(start) || !isValid(end)) return 0;
  
  let workingDays = 0;
  let currentDate = start;
  
  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      workingDays++;
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return workingDays;
};

// Get date ranges for reporting
export const getDateRanges = () => {
  const today = new Date();
  
  return {
    today: {
      start: startOfDay(today),
      end: endOfDay(today)
    },
    thisWeek: {
      start: startOfDay(addDays(today, -getDay(today))),
      end: endOfDay(addDays(addDays(today, -getDay(today)), 6))
    },
    thisMonth: {
      start: startOfMonth(today),
      end: endOfMonth(today)
    },
    thisQuarter: {
      start: startOfMonth(addMonths(today, -((getMonth(today) % 3)))),
      end: endOfMonth(addMonths(startOfMonth(addMonths(today, -((getMonth(today) % 3)))), 2))
    },
    thisYear: {
      start: startOfYear(today),
      end: endOfYear(today)
    },
    lastMonth: {
      start: startOfMonth(addMonths(today, -1)),
      end: endOfMonth(addMonths(today, -1))
    },
    lastQuarter: {
      start: startOfMonth(addMonths(today, -3 - (getMonth(today) % 3))),
      end: endOfMonth(addMonths(startOfMonth(addMonths(today, -3 - (getMonth(today) % 3))), 2))
    },
    lastYear: {
      start: startOfYear(addYears(today, -1)),
      end: endOfYear(addYears(today, -1))
    },
    custom: {
      start: startOfMonth(addMonths(today, -6)),
      end: endOfMonth(today)
    }
  };
};

// Get days in month
export const getDaysInMonth = (date: Date | string): Date[] => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return [];
  
  const start = startOfMonth(parsedDate);
  const end = endOfMonth(parsedDate);
  
  return eachDayOfInterval({ start, end });
};

// Get months in year
export const getMonthsInYear = (year: number): Date[] => {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  return eachMonthOfInterval({ start, end });
};

// Format date range
export const formatDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  const start = formatDate(startDate, formatStr);
  const end = formatDate(endDate, formatStr);
  
  return `${start} - ${end}`;
};

// Get relative time string
export const getRelativeTimeString = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  const now = new Date();
  const diffInDays = differenceInDays(now, parsedDate);
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export default {
  formatDate,
  calculateAge,
  calculateTenure,
  formatTenure,
  calculateWorkingDays,
  getDateRanges,
  getDaysInMonth,
  getMonthsInYear,
  formatDateRange,
  getRelativeTimeString
};