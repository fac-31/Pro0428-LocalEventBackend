import { db } from '../database/connect.ts';

const events = db.collection("events");

// Helper: Get today's date at midnight
function getTodayMidnight(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function deleteOldEvents() {
  const today = getTodayMidnight();

  // Delete documents with 'date' < today
  const deleteCount = await events.deleteMany({
    date: { $lt: today }
  });

  console.log(`Deleted ${deleteCount} old event(s).`);
}
