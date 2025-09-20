import { Worker } from "bullmq";
import { connection } from "../lib/queue";
import prisma from "../lib/prisma";
import { expandTopicWithLLM, summarizeArticle } from "./utils/llmClient";
import {
  fetchFromHackerNews,
  fetchFromNewsAPI,
  fetchFromWikipedia,
} from "./utils/apiClients";
import type { RawArticles } from "./utils/types";
import { scoreAndSortArticles } from "./utils/scoreArticles";

const worker = new Worker(
  "research-queue",
  async (job) => {
    const { jobId } = job.data;

    const logProgress = async (message: string) => {
      console.log(`[Job ${jobId}] ${message}`);
      await prisma.jobLog.create({
        data: { jobId, message },
      });
    };

    try {
      // 1
      const researchJob = await prisma.researchJob.update({
        where: { id: jobId },
        data: { status: "PROCESSING" },
      });
      const topic = researchJob.topic;
      await logProgress(`[INFO] Started processing job for topic: "${topic}"`);

      // 2
      const expandedKeywords = await expandTopicWithLLM(topic);
      await logProgress(
        `[INFO] Expanded topic to keywords: ${expandedKeywords.join(", ")}`
      );

      // 3
      const fetchPromises = expandedKeywords.flatMap((keyword) => [
        fetchFromHackerNews(keyword),
        fetchFromNewsAPI(keyword),
        fetchFromWikipedia(keyword),
      ]);
      const resultsFromAllKeywords = await Promise.all(fetchPromises);
      const allArticles = resultsFromAllKeywords.flat();

      // 4
      const uniqueArticlesMap = new Map<string, RawArticles>();
      allArticles.forEach((article) => {
        if (!uniqueArticlesMap.has(article.url)) {
          uniqueArticlesMap.set(article.url, article);
        }
      });
      const uniqueArticles = Array.from(uniqueArticlesMap.values());
      await logProgress(
        `[INFO] Found ${uniqueArticles.length} unique articles.`
      );

      const sortedArticles = scoreAndSortArticles(
        uniqueArticles,
        expandedKeywords
      );
      const top5Articles = sortedArticles.slice(0, 5);
      if (top5Articles.length === 0) {
        throw new Error("Could not find any relevant articles for the topic.");
      }

      await logProgress(
        `[PROCESS] Ranked and selected top ${top5Articles.length} articles for summarization.`
      );

      const finalResults = [];

      for (const article of top5Articles) {
        await logProgress(`[SUMMARIZE] Summarizing: "${article.title}"`);
        const { summary, keywords } = await summarizeArticle(
          article.title,
          article.content
        );

        finalResults.push({
          source: article.source,
          title: article.title,
          url: article.url,
          summary,
          keywords,
        });
      }

      await prisma.researchJob.update({
        where: { id: jobId },
        data: {
          status: "COMPLETED",
          result: finalResults,
        },
      });
      await logProgress("[SUCCESS] Job completed and results saved.");
      console.log(`✅ Job ${jobId} completed!`);
    } catch (error: any) {
      console.error(`[Job ${jobId}] Job failed:`, error);
      await logProgress(`[ERROR] Job failed: ${error.message}`);
      await prisma.researchJob.update({
        where: { id: jobId },
        data: { status: "FAILED" },
      });
      throw error;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.info(`${job.data.jobId} has completed!`);
});

worker.on("failed", (job, err) => {
  console.error(`${job?.data.jobId} has failed with ${err.message}`);
});

console.log("Research worker is running and listening for jobs...");
