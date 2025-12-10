import { Document, Summary } from "@/lib/types/api";

export async function fetchDocuments(question: string): Promise<Document[]> {
  const response = await fetch(`/api/documents?question=${encodeURIComponent(question)}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch documents: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getDocumentById(id: string): Promise<Document | null> {
  const response = await fetch(`/api/documents/${id}`);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`);
  }
  
  return response.json();
}

export async function summarizeWithAIGateway(
  question: string,
  documents: Document[]
): Promise<Summary> {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question, documents }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to generate summary: ${response.statusText}`);
  }
  
  return response.json();
}

export async function storeVectorEmbedding(
  document: Document
): Promise<void> {
  const response = await fetch("/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(document),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to store embedding: ${response.statusText}`);
  }
}

export async function continueWorkflow(
  summary: Summary,
  approved: boolean
): Promise<void> {
  const response = await fetch("/api/workflow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ summary, approved }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to continue workflow: ${response.statusText}`);
  }
}
