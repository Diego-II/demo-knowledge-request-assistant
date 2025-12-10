import { NextRequest, NextResponse } from "next/server";
import { start } from "workflow/api";
import { continueKnowledgeRequestWorkflow } from "@/workflows/knowledge-request";
import { Summary } from "@/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, summary } = body as {
      question: string;
      summary: Summary;
    };

    if (!question || !summary) {
      return NextResponse.json(
        { error: "Question and summary are required" },
        { status: 400 }
      );
    }

    // Generate a unique webhook token for this approval
    const webhookToken = `approval_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Start the continuation workflow in the background
    // The workflow will wait for the webhook to be called
    start(continueKnowledgeRequestWorkflow, [question, summary, webhookToken]).catch(
      (error) => {
        console.error("Error starting approval workflow:", error);
      }
    );

    // Construct the webhook URL
    // Workflow DevKit creates webhooks at /.well-known/workflow/v1/webhook/[token]
    // For local development, use localhost. For production, use the actual domain
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const webhookUrl = `${host}/.well-known/workflow/v1/webhook/${webhookToken}`;

    return NextResponse.json({
      success: true,
      webhookUrl,
      webhookToken,
    });
  } catch (error) {
    console.error("Error creating approval workflow:", error);
    return NextResponse.json(
      { error: "Failed to create approval workflow" },
      { status: 500 }
    );
  }
}
