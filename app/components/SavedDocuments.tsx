"use client";

// Client component for displaying saved documents with real-time updates
// Polls the API to show newly created documents

import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedDocument {
  id: string;
  question: string;
  originalSummary: string;
  humanRevision?: string;
  appendix: string;
  createdAt: string;
  filePath: string;
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function SavedDocuments() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/saved-documents");
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error("Error fetching saved documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDocuments();

    // Poll every 2 seconds for new documents
    const interval = setInterval(fetchDocuments, 2000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading && documents.length === 0) {
    return null;
  }

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Saved Documents</h2>
      <div className="space-y-3">
        {documents.map((doc) => {
          const summaryText = doc.humanRevision || doc.originalSummary;
          const truncatedSummary = truncateText(summaryText);
          const hasMore = summaryText.length > 150;

          return (
            <Link
              key={doc.id}
              href={`/saved/${doc.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md hover:border-gray-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {doc.question}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncatedSummary}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(doc.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="text-blue-600 text-sm font-medium">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
