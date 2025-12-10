import { loadKnowledgeBase, calculateRelevance } from "@/lib/utils/knowledge-base";
import { Document, Summary } from "@/lib/types/api";

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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock summary - in production, this will call Ship AI Gateway
  const citations = documents.map((doc) => doc.id);

  if (documents.length === 0) {
    return {
      text: `I couldn't find relevant information about "${question}" in the knowledge base. Please try rephrasing your question or asking about Mario Kart 8 characters, tracks, shortcuts, vehicle customization, or game mechanics.`,
      citations: [],
    };
  }

  // Generate a simple summary based on the retrieved documents
  const topics = documents.map((doc) => doc.title).join(", ");
  const summary = `Based on the retrieved documents about ${topics}, here's what I found regarding "${question}": ${documents
    .map((doc) => doc.content)
    .join(" ")}`;

  return {
    text: summary,
    citations,
  };
}
