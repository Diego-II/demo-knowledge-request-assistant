// Server component that orchestrates the results display
// This demonstrates server component composition
// Now integrated with Workflow DevKit via handleKnowledgeRequest workflow

import { start } from "workflow/api";
import { handleKnowledgeRequest } from "@/workflows/knowledge-request";
import { DocumentsLoader } from "./DocumentsLoader";
import { SummaryDisplay } from "./SummaryDisplay";

interface ResultsAreaProps {
  question: string;
}

// Server-side helper to run the knowledge request workflow
async function runKnowledgeRequestWorkflow(question: string) {
  const run = await start(handleKnowledgeRequest, [question]);
  return await run.returnValue;
}

export async function ResultsArea({ question }: ResultsAreaProps) {
  "use cache";
  // Execute the workflow to fetch documents and generate summary
  // The workflow orchestrates both steps: fetchDocumentsStep and summarizeStep
  const { documents, summary } = await runKnowledgeRequestWorkflow(question);

  return (
    <div className="space-y-8">
      {/* DocumentsLoader now receives documents as props from the workflow */}
      {/* No Suspense needed here since DocumentsLoader is synchronous */}
      <DocumentsLoader documents={documents} question={question} />

      {/* Summary display */}
      <SummaryDisplay summary={summary} />
    </div>
  );
}
