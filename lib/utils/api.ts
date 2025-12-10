// Placeholder functions for Knowledge Request Assistant
// These will be replaced with real API calls later

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

// TODO: Replace with real document retrieval from vector database
// This will use Ship AI Workflows for orchestration
export async function fetchDocuments(question: string): Promise<Document[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock documents - in production, this will query a vector database
  return [
    {
      id: "doc-1",
      title: "Introduction to Next.js 16",
      content: "Next.js 16 introduces new features including improved caching strategies and better server component support.",
      source: "https://nextjs.org/docs",
      relevanceScore: 0.95,
    },
    {
      id: "doc-2",
      title: "Server Components Best Practices",
      content: "Server components should be used by default. Only use client components when you need interactivity or browser APIs.",
      source: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
      relevanceScore: 0.87,
    },
    {
      id: "doc-3",
      title: "Suspense and Data Fetching",
      content: "Use Suspense boundaries to handle loading states for async data fetching in server components.",
      source: "https://nextjs.org/docs/app/building-your-application/data-fetching/loading-ui-and-streaming",
      relevanceScore: 0.82,
    },
  ];
}

// TODO: Replace with real AI Gateway API call
// This will use Ship AI Gateway for LLM inference
export async function summarizeWithAIGateway(
  question: string,
  documents: Document[]
): Promise<Summary> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock summary - in production, this will call Ship AI Gateway
  const citations = documents.map((doc) => doc.id);
  return {
    text: `Based on the retrieved documents, ${question} can be answered by understanding that Next.js 16 provides improved server component support, better caching strategies, and enhanced data fetching patterns. The documents emphasize using server components by default and leveraging Suspense boundaries for optimal performance.`,
    citations,
  };
}

// TODO: Replace with real vector embedding storage
// This will use Ship AI Workflows to store embeddings in a vector database
export async function storeVectorEmbedding(
  document: Document
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock storage - in production, this will store embeddings in a vector database
  console.log(`Storing embedding for document: ${document.id}`);
}

// TODO: Replace with real workflow continuation
// This will use Ship AI Workflows to trigger the next step in the approval workflow
export async function continueWorkflow(
  summary: Summary,
  approved: boolean
): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock workflow continuation - in production, this will trigger Ship AI Workflows
  console.log(`Workflow continued with approved: ${approved}`);
}
