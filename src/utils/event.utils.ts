import { Event, FullEvent } from '../models/event.model.ts';

export const normalizeEventTitle = (event: Event): string => {
  let normalizedTitle = event.name;

  normalizedTitle = normalizedTitle.toLowerCase();
  //removes years
  normalizedTitle = normalizedTitle.replace(/\b(19|20)\d{2}\b/g, ""); //removes years
  // Remove dates in various formats
  normalizedTitle = normalizedTitle.replace(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g, "");
  normalizedTitle = normalizedTitle.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(st|nd|rd|th)?\b/gi, "");
  //removes common title words
  normalizedTitle = normalizedTitle.replace(/\b(edition|annual|festival|event|tour|series|concert)\b/gi, "");
  // Remove special characters and extra whitespace
  normalizedTitle = normalizedTitle.replace(/[^\w\s]/g, " ");
  normalizedTitle = normalizedTitle.replace(/\s+/g, " ").trim();
  
  return normalizedTitle;
};

export const normalizeEventDate = (event: Event): Date => {
  return new Date(event.date);
};

export const addNormalizedProperties = (event: Event): FullEvent => {
  const fullEvent: FullEvent = {
    ...event,
    normalizedName: normalizeEventTitle(event),
    date: normalizeEventDate(event)
  };
  return fullEvent;
}