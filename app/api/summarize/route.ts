import { NextRequest, NextResponse } from "next/server";
import { Document, Summary } from "@/lib/types/api";

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

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock summary - in production, this will call Ship AI Gateway
    const citations = documents.map((doc) => doc.id);

    let summary: Summary;
    if (documents.length === 0) {
      summary = {
        text: `I couldn't find relevant information about "${question}" in the knowledge base. Please try rephrasing your question or asking about Mario Kart 8 characters, tracks, shortcuts, vehicle customization, or game mechanics.`,
        citations: [],
      };
    } else {
      // Generate a simple summary based on the retrieved documents
      const topics = documents.map((doc) => doc.title).join(", ");
      const summaryText = `Based on the retrieved documents about ${topics}, here's what I found regarding "${question}": ${documents
        .map((doc) => doc.content)
        .join(" ")}`;

      summary = {
        text: summaryText,
        citations,
      };
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
