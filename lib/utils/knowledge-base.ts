import knowledgeBase from "../../data/knowledge-base.json";
import { Document } from "@/lib/types/api";

export function loadKnowledgeBase(): Document[] {
  try {
    return knowledgeBase as Document[];
  } catch (error) {
    console.error("Error loading knowledge base:", error);
    return [];
  }
}

export function calculateRelevance(question: string, document: Document): number {
  const questionLower = question.toLowerCase();
  const titleLower = document.title.toLowerCase();
  const contentLower = document.content.toLowerCase();

  let score = document.relevanceScore;

  // Boost score if question keywords appear in title
  const questionWords = questionLower.split(/\s+/);
  const titleMatches = questionWords.filter((word) =>
    titleLower.includes(word)
  ).length;
  score += titleMatches * 0.1;

  // Boost score if question keywords appear in content
  const contentMatches = questionWords.filter((word) =>
    contentLower.includes(word)
  ).length;
  score += contentMatches * 0.05;

  // Specific keyword boosts
  if (questionLower.includes("character") && titleLower.includes("character")) {
    score += 0.15;
  }
  if (questionLower.includes("shortcut") && contentLower.includes("shortcut")) {
    score += 0.15;
  }
  if (questionLower.includes("track") && (titleLower.includes("track") || contentLower.includes("track"))) {
    score += 0.1;
  }
  if (questionLower.includes("vehicle") || questionLower.includes("kart")) {
    if (titleLower.includes("vehicle") || titleLower.includes("kart")) {
      score += 0.15;
    }
  }

  return Math.min(1.0, score);
}
