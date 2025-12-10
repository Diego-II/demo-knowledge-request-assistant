"use client";

// Client component for editing and approving summaries
// Integrated with Workflow DevKit for human-in-the-loop approval

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Summary } from "@/lib/types/api";

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
  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const router = useRouter();

  // Initialize the approval workflow and get the webhook URL
  useEffect(() => {
    const initializeWorkflow = async () => {
      try {
        const response = await fetch("/api/approval-workflow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            summary: { ...initialSummary, text: summary },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setWebhookUrl(data.webhookUrl);
        }
      } catch (error) {
        console.error("Error initializing approval workflow:", error);
      }
    };

    initializeWorkflow();
  }, [question, initialSummary, summary]);

  const handleApprove = async () => {
    if (!webhookUrl) {
      alert("Workflow not ready yet. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the webhook URL to continue the workflow
      // This will trigger the workflow to continue in the background
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: true,
          humanRevision: summary,
        }),
      });

      if (response.ok) {
        // Redirect immediately - workflow continues in background
        router.push("/");
      } else {
        throw new Error("Failed to approve workflow");
      }
    } catch (error) {
      console.error("Error approving summary:", error);
      alert("Error approving summary. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!webhookUrl) {
      alert("Workflow not ready yet. Please wait a moment and try again.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the webhook URL to reject the workflow
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved: false,
          humanRevision: summary,
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to reject workflow");
      }
    } catch (error) {
      console.error("Error rejecting summary:", error);
      alert("Error rejecting summary. Please try again.");
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
          <strong>Note:</strong> Approving will trigger the workflow to continue in the background.
          You'll be redirected to the home page immediately, and the final document will appear there once processing is complete.
        </p>
      </div>
    </div>
  );
}

