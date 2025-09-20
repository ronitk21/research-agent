import * as z from "zod";

export const expandTopicSchema = z.object({
  keywords: z.array(z.string()),
});

export const summarizeArticleSchema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
});
