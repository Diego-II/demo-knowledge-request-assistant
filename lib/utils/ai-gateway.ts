import { Experimental_Agent as Agent } from "ai";
import { Document } from "@/lib/types/api";

export async function generateSummaryWithLLM(
  question: string,
  documents: Document[]
): Promise<string> {
  if (documents.length === 0) {
    return `I couldn't find relevant information about "${question}" in the knowledge base. Please try rephrasing your question or asking about Mario Kart 8 characters, tracks, shortcuts, vehicle customization, or game mechanics.`;
  }

  // Format documents for the prompt
  const documentsContext = documents
    .map(
      (doc, index) =>
        `Document ${index + 1} (ID: ${doc.id}):\nTitle: ${doc.title}\nContent: ${doc.content}\n`
    )
    .join("\n---\n\n");

  const prompt = `You are a helpful assistant that summarizes information from knowledge base documents to answer user questions.

User Question: ${question}

Relevant Documents:
${documentsContext}

Please provide a concise and accurate summary that answers the user's question based on the information in the documents above. Focus on the most relevant information and cite document IDs when referencing specific information.`;

  try {
    // Use Agent with model string format - AI Gateway will automatically route
    // when AI_GATEWAY_API_KEY is set in environment variables
    const agent = new Agent({
      model: "google/gemini-2.5-flash-lite",
    });

    const result = await agent.generate({
      prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Error generating summary with AI Gateway:", error);
    throw new Error("Failed to generate summary with AI Gateway");
  }
}
