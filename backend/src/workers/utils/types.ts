export interface RawArticles {
  source: "Wikipedia" | "NewsAPI" | "HackerNews";
  title: string;
  url: string;
  content: string;
}