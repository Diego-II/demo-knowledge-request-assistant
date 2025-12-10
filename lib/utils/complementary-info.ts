import { Experimental_Agent as Agent } from "ai";
import { Document } from "@/lib/types/api";

export interface ComplementaryInfo {
  text: string;
  sources: string[];
}

// Fetch complementary information from LLM with internet access capability
export async function fetchComplementaryInfo(
  question: string,
  originalSummary: string,
  humanRevision?: string
): Promise<ComplementaryInfo> {
  const summaryToUse = humanRevision || originalSummary;

  const prompt = `You are a helpful research assistant. The user asked: "${question}"

An initial summary was generated:
${summaryToUse}

Please provide additional complementary information that:
1. Expands on the key points in the summary
2. Provides context or background information
3. Includes related facts or insights
4. Uses internet knowledge if necessary to provide accurate, up-to-date information

Format your response as a comprehensive appendix that complements the original summary. Be thorough but concise.`;

  try {
    // Use Agent with model that supports internet access
    // Note: You may need to configure the model to enable internet access
    const agent = new Agent({
      model: "google/gemini-2.5-flash-lite",
    });

    const result = await agent.generate({
      prompt,
      // If your AI Gateway supports internet access, enable it here
      // tools: [internetSearchTool],
    });

    // Extract sources if available (this would depend on your AI Gateway implementation)
    const sources: string[] = [];
    
    return {
      text: result.text,
      sources,
    };
  } catch (error) {
    console.error("Error fetching complementary info:", error);
    // Return a fallback message
    return {
      text: "Unable to fetch additional complementary information at this time. The original summary contains the available information.",
      sources: [],
    };
  }
}
