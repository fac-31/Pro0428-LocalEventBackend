import { Event, FrequencyObject, FullEvent } from "https://raw.githubusercontent.com/fac-31/Pro0428-LocalEventShared/main/src/models/event.model.ts";

// Initial cleaning of titles
export const normalizeEventTitle = (event: Event): string => {
  let normalizedTitle = event.name;

  normalizedTitle = normalizedTitle.toLowerCase();
  //removes years
  normalizedTitle = normalizedTitle.replace(/\b(19|20)\d{2}\b/g, '');
  // Remove dates in various formats
  normalizedTitle = normalizedTitle.replace(
    /\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/g,
    '',
  );
  normalizedTitle = normalizedTitle.replace(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2}(st|nd|rd|th)?\b/gi,
    '',
  );
  // Remove special characters and extra whitespace
  normalizedTitle = normalizedTitle.replace(/[^\w\s]/g, ' ');
  normalizedTitle = normalizedTitle.replace(/\s+/g, ' ').trim();

  return normalizedTitle;
};

//turns date into an object
export const normalizeEventDate = (event: Event): Date => {
  return new Date(event.date);
};

//Calls round one of normalising titles
export const addNormalizedProperties = (event: Event): FullEvent => {
  const fullEvent: FullEvent = {
    ...event,
    normalizedName: normalizeEventTitle(event),
    date: normalizeEventDate(event),
  };
  return fullEvent;
};

//creates an event key to match events by
export function createEventKey(
  TF_IDR_Object: { [key: string]: { [key: string]: number } },
  eventsV1: FullEvent[],
) {
  eventsV1.forEach((event) => {
    const eventTerms = TF_IDR_Object[event.normalizedName];

    if (eventTerms) {
      const validTerms = Object.keys(eventTerms).filter((term) =>
        term.length >= 3
      );

      if (validTerms.length > 0) {
        const highestTfIdfTerm = validTerms.reduce((a, b) =>
          eventTerms[a] > eventTerms[b] ? a : b
        );

        event.normalizedName = highestTfIdfTerm;
      }
    }
    const formattedDate = event.date.toDateString();
    const key = event.normalizedName + formattedDate;
    event.eventKey = key;
  });

  return eventsV1;
}

const names: string[] = [];
const allTerms: string[] = [];
//formats data for term frequency calculations
export function createFrequencyArrays(testInput: FullEvent) {
  const events = testInput;

  let words: string[] = [];

  names.push(events.normalizedName);
  words = events.normalizedName.split(' ');

  words.forEach((word) => {
    allTerms.push(word);
  });

  return { 'names': names, 'allTerms': allTerms };
}

// Term frequency: frequency_of_appearance / number_of_terms
// Inverse Document frequency: number_of_strings / number_of_strings_with_terms
// TF-IDF value: Term_frequency * Inverse_document_frequency
export function calculateTermFrequency(frequencyObject: FrequencyObject) {
  const result: { [eventName: string]: { [term: string]: number } } = {};

  frequencyObject.names.forEach((name) => {
    const terms = name.split(' ');
    result[name] = {};

    terms.forEach((term) => {
      const count: number = terms.filter((t) => t === term).length;
      const termFrequency: number = count / terms.length;

      const docCount: number = frequencyObject.allTerms.filter((allTerm) =>
        allTerm === term
      ).length;
      const inverseDocumentFrequency: number = frequencyObject.names.length /
        docCount;

      const TF_IDF = termFrequency * inverseDocumentFrequency;
      result[name][term] = TF_IDF;
    });
  });

  return result;
}

//co-ordinates event utility functions
export function normaliseEvents(events: Event[]): FullEvent[] {
  let frequencyObject: FrequencyObject = { names: [], allTerms: [] };

  const eventsV1: FullEvent[] = [];
  for (const [, event] of events.entries()) {
    const finalObj = addNormalizedProperties(event);
    eventsV1.push(finalObj);
    frequencyObject = createFrequencyArrays(finalObj);
  }

  const TF_IDF_Object = calculateTermFrequency(frequencyObject);
  const result: FullEvent[] = createEventKey(TF_IDF_Object, eventsV1);

  return result;
}
