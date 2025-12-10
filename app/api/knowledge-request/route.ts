import { NextRequest, NextResponse } from "next/server";
import { start } from "workflow/api";
import { handleKnowledgeRequest } from "@/workflows/knowledge-request";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Missing or empty question parameter" },
        { status: 400 }
      );
    }

    // Start the workflow and wait for completion
    // Note: This is a blocking pattern suitable for short-running workflows
    // For longer workflows, consider using run.wait() with polling or webhooks
    const run = await start(handleKnowledgeRequest, [question]);
    const result = await run.returnValue;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error executing knowledge request workflow:", error);
    return NextResponse.json(
      { error: "Failed to execute knowledge request workflow" },
      { status: 500 }
    );
  }
}
