// Server component for displaying documents
// This component will be wrapped in Suspense to handle loading states
// TODO: Add cache() wrapper here for Next.js 16 caching

import { Document } from "@/lib/utils/api";

interface DocumentListProps {
  documents: Document[];
}

export function DocumentList({ documents }: DocumentListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Retrieved Documents ({documents.length})
      </h2>
      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {doc.title}
              </h3>
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {Math.round(doc.relevanceScore * 100)}% relevant
              </span>
            </div>
            <p className="mb-2 text-sm text-gray-600">{doc.content}</p>
            <a
              href={doc.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {doc.source}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

