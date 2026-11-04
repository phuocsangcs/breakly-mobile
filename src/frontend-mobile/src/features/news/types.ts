// Domain types for VnExpress RSS sources and parsed articles.
export interface NewsSource {
  id: string;
  externalRef: string;
  title: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  imageUrl: string | null;
  link: string;
  source: string;
  publishedAt: string;
}

