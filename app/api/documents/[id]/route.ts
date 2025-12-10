import { NextRequest, NextResponse } from "next/server";
import { loadKnowledgeBase } from "@/lib/utils/knowledge-base";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const allDocuments = loadKnowledgeBase();
  const document = allDocuments.find((doc) => doc.id === id);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(document);
}
