import { NextRequest, NextResponse } from "next/server";
import { start } from "workflow/api";
import { continueKnowledgeRequestWorkflow } from "@/workflows/knowledge-request";
import { Summary } from "@/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, approved, question, webhookToken } = body as {
      summary: Summary;
      approved: boolean;
      question: string;
      webhookToken: string;
    };

    if (!summary || typeof approved !== "boolean" || !question || !webhookToken) {
      return NextResponse.json(
        { error: "Summary, approved status, question, and webhookToken are required" },
        { status: 400 }
      );
    }

    if (!approved) {
      return NextResponse.json({
        success: true,
        approved: false,
        message: "Workflow stopped - approval was rejected",
      });
    }

    // Start the continuation workflow in the background
    // Don't await - let it run asynchronously
    start(continueKnowledgeRequestWorkflow, [question, summary, webhookToken]).catch(
      (error) => {
        console.error("Error in background workflow continuation:", error);
      }
    );

    // Return immediately so the user can be redirected
    return NextResponse.json({
      success: true,
      approved: true,
      message: "Approval received, workflow continuing in background",
    });
  } catch (error) {
    console.error("Error continuing workflow:", error);
    return NextResponse.json(
      { error: "Failed to continue workflow" },
      { status: 500 }
    );
  }
}
