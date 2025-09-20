import type { RawArticles } from "./types";

export function scoreAndSortArticles(
  articles: RawArticles[],
  keywords: string[]
): RawArticles[] {
  return articles
    .map((article) => {
      let score = 0;

      const titleScore = keywords.reduce((sum, kw) => {
        return (
          sum + (article.title.toLowerCase().includes(kw.toLowerCase()) ? 2 : 0)
        );
      }, 0);

      const contentScore = keywords.reduce((sum, kw) => {
        const regex = new RegExp(`\\b${kw}\\b`, "gi");
        return sum + (article.content.match(regex)?.length || 0);
      }, 0);

      score = titleScore + contentScore;

      return { ...article, score };
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}
