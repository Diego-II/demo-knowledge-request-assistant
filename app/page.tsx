// Homepage - Server component by default
// This page demonstrates:
// - Server component composition
// - Suspense boundaries for async data fetching
// - Client component integration (QuestionForm)
// TODO: Add cache() wrappers for data fetching
// TODO: Integrate with Ship AI Workflows for orchestration

import { Suspense } from "react";
import { QuestionForm } from "./components/QuestionForm";
import { ResultsArea } from "./components/ResultsArea";

interface HomePageProps {
  searchParams: Promise<{ question?: string }>;
}

// Component to handle searchParams and render results
// This is separated to properly handle Suspense boundaries
async function ResultsSection({
  searchParams,
}: {
  searchParams: Promise<{ question?: string }>;
}) {
  const params = await searchParams;
  const question = params.question;

  if (!question) {
    return null;
  }

  return (
    <>
      <div className="mt-8">
        <ResultsArea question={question} />
      </div>
      <div className="mt-8 text-center">
        <a
          href={`/approver?question=${encodeURIComponent(question)}`}
          className="inline-block rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700"
        >
          Review & Approve Summary
        </a>
      </div>
    </>
  );
}

// Loading fallback for results section
function ResultsLoading() {
  return (
    <div className="mt-8 space-y-8">
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      </div>
      <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
    </div>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Knowledge Request Assistant
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Ask a question and get AI-powered answers with citations
          </p>
        </div>

        {/* Client component for form interactivity */}
        {/* This demonstrates client components under server components */}
        <div className="mb-8">
          <QuestionForm />
        </div>

        {/* Results area wrapped in Suspense */}
        {/* This demonstrates Next.js 16 Suspense for async searchParams and data fetching */}
        <Suspense fallback={<ResultsLoading />}>
          <ResultsSection searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
