import { NextRequest, NextResponse } from "next/server";
import { Document } from "@/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    const document = (await request.json()) as Document;

    if (!document || !document.id) {
      return NextResponse.json(
        { error: "Document is required" },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock storage - in production, this will store embeddings in a vector database
    console.log(`Storing embedding for document: ${document.id}`);

    return NextResponse.json({ success: true, documentId: document.id });
  } catch (error) {
    console.error("Error storing embedding:", error);
    return NextResponse.json(
      { error: "Failed to store embedding" },
      { status: 500 }
    );
  }
}
