import { NextResponse } from "next/server";
import { loadSavedDocumentsIndex } from "@/lib/utils/file-storage";

export async function GET() {
  try {
    const documents = await loadSavedDocumentsIndex();
    return NextResponse.json(documents);
  } catch (error) {
    console.error("Error loading saved documents:", error);
    return NextResponse.json(
      { error: "Failed to load saved documents" },
      { status: 500 }
    );
  }
}
