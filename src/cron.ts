Deno.cron("save events cron", "*/10 * * * *", async () => {
  try {
    const response = await fetch("https://the-locals.deno.dev/events/cron/save-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (response.ok) {
      console.log("Events cron job executed successfully");
    } else {
      console.error("Cron job failed with status:", response.status);
    }
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});

//cron for every 10mins
// "*/10 * * * *"

// cron for midnight
// "0 0 * * *"