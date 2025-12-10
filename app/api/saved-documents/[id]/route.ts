import { NextRequest, NextResponse } from "next/server";
import { getSavedDocument } from "@/lib/utils/file-storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await getSavedDocument(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching saved document:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved document" },
      { status: 500 }
    );
  }
}
