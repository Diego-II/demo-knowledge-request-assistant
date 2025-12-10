// Server component for displaying documents
// This component will be wrapped in Suspense to handle loading states
// TODO: Add cache() wrapper here for Next.js 16 caching

import Link from "next/link";
import { Document } from "@/lib/types/api";

interface DocumentListProps {
  documents: Document[];
  question: string;
}

export function DocumentList({ documents, question }: DocumentListProps) {
  const questionParam = encodeURIComponent(question);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Retrieved Documents ({documents.length})
      </h2>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-start justify-between">
              <Link
                href={`/doc/${doc.id}?question=${questionParam}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                {doc.title}
              </Link>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {Math.round(doc.relevanceScore * 100)}% relevant
              </span>
            </div>
            <p className="mb-3 text-sm text-gray-600 line-clamp-3">
              {doc.content}
            </p>
            <div className="flex items-center justify-between">
              <Link
                href={`/doc/${doc.id}?question=${questionParam}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                View full document →
              </Link>
              <a
                href={doc.source}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
              >
                {doc.source}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

