import { NextRequest, NextResponse } from "next/server";
import { Summary } from "@/lib/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, approved } = body as {
      summary: Summary;
      approved: boolean;
    };

    if (!summary || typeof approved !== "boolean") {
      return NextResponse.json(
        { error: "Summary and approved status are required" },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock workflow continuation - in production, this will trigger Ship AI Workflows
    console.log(`Workflow continued with approved: ${approved}`);

    return NextResponse.json({
      success: true,
      approved,
      message: approved
        ? "Workflow continued with approval"
        : "Workflow updated with rejection",
    });
  } catch (error) {
    console.error("Error continuing workflow:", error);
    return NextResponse.json(
      { error: "Failed to continue workflow" },
      { status: 500 }
    );
  }
}
