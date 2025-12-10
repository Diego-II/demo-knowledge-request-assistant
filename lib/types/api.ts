export interface Document {
  id: string;
  title: string;
  content: string;
  source: string;
  relevanceScore: number;
}

export interface Summary {
  text: string;
  citations: string[];
}
