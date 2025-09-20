import axios from "axios";
import type { RawArticles } from "./types";

export async function fetchFromNewsAPI(topic: string, retries = 2): Promise<RawArticles[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("NewsAPI key not set. Skipping NewsAPI search.");
    return [];
  }
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    topic
  )}&apiKey=${apiKey}&pageSize=20&sortBy=relevancy`;

  try {
    const response = await axios.get(url);
    return (response.data.articles || []).map(
      (article: any): RawArticles => ({
        source: "NewsAPI",
        title: article.title,
        url: article.url,
        content:
          article.content || article.description || "No content available.",
      })
    );
  } catch (error) {
    console.error(`Error fetching from NewsAPI for topic "${topic}":`, error);
    return [];
  }
}

async function getHackerNewsStory(
  id: number
): Promise<{ title: string; url: string; text?: string } | null> {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    const story = response.data;
    if (story && story.title && story.url) {
      return { title: story.title, url: story.url, text: story.text || "" };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function fetchFromHackerNews(
  topic: string
): Promise<RawArticles[]> {
  try {
    const topStoriesResponse = await axios.get(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    const storyPromises = (topStoriesResponse.data as number[])
      .slice(0, 30)
      .map((id) => getHackerNewsStory(id));
    const stories = await Promise.all(storyPromises);

    return stories
      .filter(
        (story): story is { title: string; url: string; text?: string } =>
          story !== null &&
          story.title.toLowerCase().includes(topic.toLowerCase())
      )
      .map(
        (story): RawArticles => ({
          source: "HackerNews",
          title: story.title,
          url: story.url,
          content: story.text || "No content available.",
        })
      );
  } catch (error) {
    console.error(
      `Error fetching from HackerNews for topic "${topic}":`,
      error
    );
    return [];
  }
}

export async function fetchFromWikipedia(
  topic: string
): Promise<RawArticles[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    topic
  )}&format=json&srlimit=10`;
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");

  try {
    const response = await axios.get(url);
    return (response.data.query.search || []).map(
      (result: any): RawArticles => ({
        source: "Wikipedia",
        title: result.title,
        url: `https://en.wikipedia.org/?curid=${result.pageid}`,
        content: stripHtml(result.snippet) + "...",
      })
    );
  } catch (error) {
    console.error(`Error fetching from Wikipedia for topic "${topic}":`, error);
    return [];
  }
}
