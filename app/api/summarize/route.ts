import { NextRequest, NextResponse } from "next/server";
import { Document, Summary } from "@/lib/types/api";
import { generateSummaryWithLLM } from "@/lib/utils/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, documents } = body as {
      question: string;
      documents: Document[];
    };

    if (!question || !documents) {
      return NextResponse.json(
        { error: "Question and documents are required" },
        { status: 400 }
      );
    }

    // Use top 3 ranked documents (they should already be sorted by relevance)
    const topDocuments = documents.slice(0, 3);

    // Generate summary using AI Gateway with LLM
    const summaryText = await generateSummaryWithLLM(question, topDocuments);
    const citations = topDocuments.map((doc) => doc.id);

    const summary: Summary = {
      text: summaryText,
      citations,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
