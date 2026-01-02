import type { Experience } from '../types';

/**
 * Sorts experience entries in reverse chronological order (most recent first).
 * Handles null end dates by treating them as current positions (sorted first).
 * 
 * @param experiences - Array of experience entries to sort
 * @returns New array sorted by start date in descending order
 */
export function sortExperienceByDate(experiences: Experience[]): Experience[] {
  return [...experiences].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime();
    const dateB = new Date(b.startDate).getTime();
    
    // Sort in descending order (most recent first)
    return dateB - dateA;
  });
}

/**
 * Formats a date string to a readable format (e.g., "Jan 2024")
 * 
 * @param dateString - ISO date string or null for current positions
 * @returns Formatted date string or "Present" for null dates
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) {
    return 'Present';
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formats the duration of an experience entry
 * 
 * @param startDate - Start date string
 * @param endDate - End date string or null for current positions
 * @returns Formatted duration string (e.g., "Jan 2024 - Present")
 */
export function formatDuration(startDate: string, endDate: string | null): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
