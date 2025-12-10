// Workflow orchestrator for knowledge request processing
// This workflow coordinates document fetching, AI summarization, human approval,
// complementary info fetching, document creation, and file storage

import { createWebhook, type RequestWithResponse } from "workflow";
import { Document, Summary } from "@/lib/types/api";
import { fetchDocuments, summarizeWithAIGateway } from "@/lib/utils/api-server";
import { fetchComplementaryInfo } from "@/lib/utils/complementary-info";
import { saveDocument, type SavedDocument } from "@/lib/utils/file-storage";

// Step 1: Fetch relevant documents for the question
async function fetchDocumentsStep(question: string) {
  "use step";
  return await fetchDocuments(question);
}

// Step 2: Generate AI summary using the fetched documents
async function summarizeStep(question: string, documents: Document[]) {
  "use step";
  return await summarizeWithAIGateway(question, documents);
}

// Step 3: Wait for human approval via webhook
async function waitForApprovalStep(
  question: string,
  summary: Summary,
  webhookRequest: RequestWithResponse
) {
  "use step";
  // Respond immediately to the webhook caller so they can redirect
  await webhookRequest.respondWith(
    new Response(
      JSON.stringify({ success: true, message: "Approval received, workflow continuing in background" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  );

  // Parse the approval data from the webhook request
  const approvalData = await webhookRequest.json();
  return {
    approved: approvalData.approved === true,
    humanRevision: approvalData.humanRevision || summary.text,
  };
}

// Step 4: Fetch complementary information from LLM
async function fetchComplementaryInfoStep(
  question: string,
  originalSummary: string,
  humanRevision?: string
) {
  "use step";
  return await fetchComplementaryInfo(question, originalSummary, humanRevision);
}

// Step 5: Create the final document with original revision and appendix
async function createDocumentStep(
  question: string,
  originalSummary: string,
  humanRevision: string,
  appendix: string
) {
  "use step";
  const documentId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  const document: SavedDocument = {
    id: documentId,
    question,
    originalSummary,
    humanRevision,
    appendix,
    createdAt: new Date().toISOString(),
    filePath: "", // Will be set by saveDocument
  };

  return document;
}

// Step 6: Save document to local file
async function saveDocumentStep(document: SavedDocument) {
  "use step";
  await saveDocument(document);
  return document;
}

// Main workflow orchestrator
export async function handleKnowledgeRequest(question: string) {
  "use workflow";
  
  // Step 1: Fetch relevant documents
  const documents = await fetchDocumentsStep(question);
  
  // Step 2: Generate summary using the fetched documents
  const summary = await summarizeStep(question, documents);
  
  // Return documents and summary for initial display
  // The approval workflow will be handled separately
  return {
    documents,
    summary,
  };
}

// Extended workflow that continues after approval
// This workflow handles: approval → fetch complementary info → create document → save to file
export async function continueKnowledgeRequestWorkflow(
  question: string,
  originalSummary: Summary,
  webhookToken: string
) {
  "use workflow";

  // Recreate the webhook with the same token to receive the approval
  // Use manual response mode to get RequestWithResponse type
  const webhook = createWebhook({ 
    token: webhookToken,
    respondWith: "manual"
  });
  
  // Step 3: Wait for human approval
  const webhookRequest = await webhook;
  const { approved, humanRevision } = await waitForApprovalStep(
    question,
    originalSummary,
    webhookRequest
  );

  if (!approved) {
    return {
      approved: false,
      message: "Workflow stopped - approval was rejected",
    };
  }

  // Step 4: Fetch complementary information
  const complementaryInfo = await fetchComplementaryInfoStep(
    question,
    originalSummary.text,
    humanRevision
  );

  // Step 5: Create the final document
  const document = await createDocumentStep(
    question,
    originalSummary.text,
    humanRevision,
    complementaryInfo.text
  );

  // Step 6: Save document to local file
  const savedDocument = await saveDocumentStep(document);

  return {
    approved: true,
    document: savedDocument,
    message: "Document created and saved successfully",
  };
}
