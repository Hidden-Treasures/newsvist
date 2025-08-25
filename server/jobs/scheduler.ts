import cron from "node-cron";
import News from "../models/News";

export function startSchedulers(): void {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      const scheduledArticles = await News.find({
        status: "scheduled",
        publishedAt: { $lte: now },
      });

      for (const article of scheduledArticles) {
        article.status = "approved";
        article.published = true;
        await article.save();
        console.log(`✅ Published scheduled article: ${article.title}`);
      }
    } catch (err) {
      console.error("❌ Scheduler error:", err);
    }
  });

  console.log("📅 Scheduler started");
}
