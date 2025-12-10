import { loadKnowledgeBase, calculateRelevance } from "@/lib/utils/knowledge-base";
import { Document, Summary } from "@/lib/types/api";
import { generateSummaryWithLLM } from "@/lib/utils/ai-gateway";

export async function fetchDocuments(question: string): Promise<Document[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allDocuments = loadKnowledgeBase();

  if (allDocuments.length === 0) {
    return [];
  }

  // Calculate relevance scores for all documents
  const scoredDocuments = allDocuments.map((doc) => ({
    ...doc,
    relevanceScore: calculateRelevance(question, doc),
  }));

  // Sort by relevance score (highest first) and return top 5
  return scoredDocuments
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);
}

export async function getDocumentById(id: string): Promise<Document | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const allDocuments = loadKnowledgeBase();
  const document = allDocuments.find((doc) => doc.id === id);

  return document || null;
}

export async function summarizeWithAIGateway(
  question: string,
  documents: Document[]
): Promise<Summary> {
  // Use top 3 ranked documents (they should already be sorted by relevance)
  const topDocuments = documents.slice(0, 3);

  // Generate summary using AI Gateway with LLM
  const summaryText = await generateSummaryWithLLM(question, topDocuments);
  const citations = topDocuments.map((doc) => doc.id);

  return {
    text: summaryText,
    citations,
  };
}
