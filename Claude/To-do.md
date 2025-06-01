# Initial ideas

1. Implement fuzzy matching for titles using string
   similarity algorithms
2. Extract and compare core event identifiers (venue
   names, artists, teams)
3. Use regex to remove common variations like year
   numbers, "edition", "festival"
4. Create a normalization function for locations (handle
   abbreviations, formatting)
5. Consider adding a time window tolerance for date
   comparison
6. Hash normalized event details for faster comparison
7. Implement Levenshtein distance with a threshold for
   title matching
8. Add logging for rejected duplicates to analyze matching
   effectiveness

Personal to-do list:

# 1

Create a test matching function that writes 2 files: a dummy database and a rejected database.

# 2

Write a function that wipes both dummy files after 1 week.
