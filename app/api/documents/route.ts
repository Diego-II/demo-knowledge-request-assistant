import { NextRequest, NextResponse } from "next/server";
import { loadKnowledgeBase, calculateRelevance } from "@/lib/utils/knowledge-base";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const question = searchParams.get("question");

  if (!question) {
    return NextResponse.json(
      { error: "Question parameter is required" },
      { status: 400 }
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const allDocuments = loadKnowledgeBase();

  if (allDocuments.length === 0) {
    return NextResponse.json([]);
  }

  // Calculate relevance scores for all documents
  const scoredDocuments = allDocuments.map((doc) => ({
    ...doc,
    relevanceScore: calculateRelevance(question, doc),
  }));

  // Sort by relevance score (highest first) and return top 5
  const results = scoredDocuments
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 5);

  return NextResponse.json(results);
}
