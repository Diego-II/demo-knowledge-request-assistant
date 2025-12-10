// Approver page - Server component by default
// This page demonstrates:
// - Human-in-the-loop workflow step
// - Server component with client component for editing
// TODO: Integrate with Ship AI Workflows for approval workflow
// TODO: Add cache() wrappers for data fetching

import { Suspense } from "react";
import { fetchDocuments, summarizeWithAIGateway } from "@/lib/utils/api";
import { SummaryEditor } from "../components/SummaryEditor";
import { SummaryDisplay } from "../components/SummaryDisplay";

interface ApproverPageProps {
  searchParams: Promise<{ question?: string }>;
}

// Loading component for Suspense fallback
function ApproverLoading() {
  return (
    <div className="space-y-8">
      <div className="mb-6 h-20 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
      </div>
      <div className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
    </div>
  );
}

// Component to handle searchParams and data fetching
// This is separated to properly handle Suspense boundaries
async function ApproverContent({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const params = await searchParams;
  const question = params.question;

  if (!question) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <p className="text-yellow-800">
          No question provided. Please go back to the homepage and submit a
          question.
        </p>
        <a
          href="/"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Back to Homepage
        </a>
      </div>
    );
  }

  // Fetch documents and generate summary
  // TODO: Wrap with cache() for Next.js 16 caching
  // TODO: This will be a Ship AI Workflow step
  const documents = await fetchDocuments(question);
  const summary = await summarizeWithAIGateway(question, documents);

  return (
    <>
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-900">Question:</p>
        <p className="mt-1 text-blue-800">{question}</p>
      </div>

      {/* Summary display */}
      <div className="mb-8">
        <SummaryDisplay summary={summary} />
      </div>

      {/* Client component for editing and approval */}
      {/* This demonstrates client components under server components */}
      {/* TODO: This will trigger Ship AI Workflows continueWorkflow() */}
      <SummaryEditor initialSummary={summary} question={question} />
    </>
  );
}

export default function ApproverPage({ searchParams }: ApproverPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Review & Approve Summary
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Review the AI-generated summary, make edits if needed, and approve
            to continue the workflow
          </p>
        </div>

        {/* Suspense boundary for async searchParams and data fetching */}
        {/* This demonstrates Next.js 16 Suspense for server components */}
        <Suspense fallback={<ApproverLoading />}>
          <ApproverContent searchParams={searchParams} />
        </Suspense>

        <div className="mt-8">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

