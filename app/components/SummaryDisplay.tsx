// Server component for displaying AI-generated summary
// TODO: This will integrate with Ship AI Gateway for real summaries
// TODO: Add cache() wrapper for Next.js 16 caching

import { Summary } from "@/lib/utils/api";

interface SummaryDisplayProps {
  summary: Summary;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        AI-Generated Summary
      </h2>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-4 text-base leading-relaxed text-gray-700">
          {summary.text}
        </p>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="mb-2 text-sm font-medium text-gray-900">Citations:</h3>
          <ul className="list-inside list-disc space-y-1">
            {summary.citations.map((citation, index) => (
              <li key={index} className="text-sm text-gray-600">
                {citation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

