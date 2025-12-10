"use client";

// Client component for editing and approving summaries
// This demonstrates client components under server components
// TODO: This will integrate with Ship AI Workflows continueWorkflow()
// TODO: Add proper error handling and loading states

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Summary } from "@/lib/types/api";
import { continueWorkflow } from "@/lib/utils/api-client";

interface SummaryEditorProps {
  initialSummary: Summary;
  question: string;
}

export function SummaryEditor({
  initialSummary,
  question,
}: SummaryEditorProps) {
  const [summary, setSummary] = useState(initialSummary.text);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      // TODO: This will call Ship AI Workflows continueWorkflow()
      await continueWorkflow(
        { ...initialSummary, text: summary },
        true
      );
      // TODO: Add success notification
      alert("Summary approved! Workflow continued.");
      router.push("/");
    } catch (error) {
      console.error("Error approving summary:", error);
      alert("Error approving summary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      // TODO: This will call Ship AI Workflows continueWorkflow()
      await continueWorkflow(
        { ...initialSummary, text: summary },
        false
      );
      // TODO: Add success notification
      alert("Summary rejected. Workflow updated.");
      router.push("/");
    } catch (error) {
      console.error("Error rejecting summary:", error);
      alert("Error rejecting summary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Edit Summary</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {isEditing ? (
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows={8}
            disabled={isSubmitting}
          />
        ) : (
          <p className="text-base leading-relaxed text-gray-700">{summary}</p>
        )}

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEditing ? "Cancel Edit" : "Edit Summary"}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleApprove}
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Approve & Continue Workflow"}
        </button>
        <button
          onClick={handleReject}
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Reject"}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> Approving will trigger the next step in the
          Ship AI Workflow. Rejecting will update the workflow state.
        </p>
      </div>
    </div>
  );
}

