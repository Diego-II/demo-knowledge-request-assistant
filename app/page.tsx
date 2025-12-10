// Homepage - Server component by default
// This page demonstrates:
// - Server component composition
// - Suspense boundaries for async data fetching
// - Client component integration (QuestionForm)
// - Workflow DevKit integration for knowledge request processing

import { Suspense } from "react";
import { QuestionForm } from "./components/QuestionForm";
import { ResultsSection } from "./components/ResultsSection";
import { SavedDocuments } from "./components/SavedDocuments";

interface HomePageProps {
  searchParams: Promise<{ question?: string }>;
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

        {/* Saved documents section - shows documents created from approved workflows */}
        <SavedDocuments />
      </div>
    </div>
  );
}
