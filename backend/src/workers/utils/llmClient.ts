import OpenAI from "openai";
import { expandTopicSchema, summarizeArticleSchema } from "./schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SummarizationResult {
  summary: string;
  keywords: string[];
}

export async function expandTopicWithLLM(topic: string): Promise<string[]> {
  console.log(`Expanding topic with OpenAI: ${topic}`);
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a helpful research assistant. Your task is to expand a given user topic into a list of 5-7 diverse, search-engine-friendly keywords and phrases. Include synonyms, related technical terms, and different angles for the topic. Respond ONLY with a JSON object containing a single key "keywords" which is an array of strings.`,
        },
        {
          role: "user",
          content: topic,
        },
      ],
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (responseContent) {
      const parsed = JSON.parse(responseContent);
      const valid = expandTopicSchema.parse(parsed);
      return [topic, ...parsed.keywords];
    }
  } catch (error) {
    console.error("Error expanding topic with OpenAI:", error);
  }

  return [topic];
}

export async function summarizeArticle(
  title: string,
  content: string
): Promise<SummarizationResult> {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a highly skilled research analyst. Your task is to provide a concise, 3-sentence summary of the provided article content and extract the 5 most relevant keywords. Respond ONLY with a JSON object with two keys: "summary" (a string) and "keywords" (an array of strings).`,
        },
        {
          role: "user",
          content: `Here is the article:\n\nTITLE: "${title}"\n\nCONTENT: "${content}"`,
        },
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    if (responseContent) {
      const parsed = JSON.parse(responseContent);
      const result = summarizeArticleSchema.safeParse(parsed);
      if (result.success) return result.data;

      console.warn(
        `LLM returned invalid summary for "${title}", using fallback.`
      );
    }
  } catch (error) {
    console.error(`Error summarizing article "${title}":`, error);
  }

  return {
    summary: "Failed to generate a summary for this article.",
    keywords: [],
  };
}
