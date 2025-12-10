// Server component that orchestrates the results display
// This demonstrates server component composition
// TODO: Add cache() wrappers for both document fetching and summary generation
// TODO: Integrate with Ship AI Workflows for step-by-step execution

import { Suspense } from "react";
import { fetchDocuments, summarizeWithAIGateway } from "@/lib/utils/api-server";
import { DocumentsLoader } from "./DocumentsLoader";
import { SummaryDisplay } from "./SummaryDisplay";

interface ResultsAreaProps {
  question: string;
}

// Loading component for Suspense fallback
function DocumentsLoading() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Retrieved Documents
      </h2>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}

export async function ResultsArea({ question }: ResultsAreaProps) {
  "use cache";
  // Fetch documents once for summary generation
  // DocumentsLoader will fetch independently for Suspense demonstration
  // TODO: Wrap with cache() for Next.js 16 caching
  // TODO: This will be orchestrated by Ship AI Workflows
  const documents = await fetchDocuments(question);
  const summary = await summarizeWithAIGateway(question, documents);

  return (
    <div className="space-y-8">
      {/* Suspense boundary for document loading */}
      {/* This demonstrates Next.js 16 Suspense for server components */}
      {/* DocumentsLoader fetches independently to show Suspense behavior */}
      <Suspense fallback={<DocumentsLoading />}>
        <DocumentsLoader question={question} />
      </Suspense>

      {/* Summary display - could also be wrapped in Suspense if needed */}
      <SummaryDisplay summary={summary} />
    </div>
  );
}

