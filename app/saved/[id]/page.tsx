import { Suspense } from "react";
import Link from "next/link";
import { getSavedDocument } from "@/lib/utils/file-storage";

interface SavedDocumentPageProps {
  params: Promise<{ id: string }>;
}

// Loading component
function DocumentLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      <div className="h-48 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
      <div className="h-64 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
    </div>
  );
}

// Component to handle async params and data fetching
async function SavedDocumentContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await getSavedDocument(id);

  if (!document) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-xl font-semibold text-red-900 mb-2">
          Document Not Found
        </h2>
        <p className="text-red-800 mb-4">
          The requested document could not be found.
        </p>
        <Link
          href="/"
          className="inline-block text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Back to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {document.question}
          </h1>
          <p className="text-sm text-gray-500">
            Created: {new Date(document.createdAt).toLocaleString()}
          </p>
        </div>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Back to Homepage
        </Link>
      </div>

      {/* Summary Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Summary
        </h2>
        <div className="prose max-w-none">
          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
            {document.humanRevision || document.originalSummary}
          </p>
        </div>
        {document.humanRevision && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              This summary was revised by a human reviewer.
            </p>
          </div>
        )}
      </div>

      {/* Appendix Section */}
      {document.appendix && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>
          <div className="prose max-w-none">
            <p className="text-base leading-relaxed text-gray-700 whitespace-pre-wrap">
              {document.appendix}
            </p>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Document ID:</strong> {document.id}
          </p>
          <p className="mt-1">
            <strong>Original Summary:</strong>{" "}
            {document.humanRevision ? "Revised" : "Unchanged"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SavedDocumentPage({
  params,
}: SavedDocumentPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense fallback={<DocumentLoading />}>
          <SavedDocumentContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}
