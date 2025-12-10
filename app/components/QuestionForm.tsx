"use client";

// Client component for form interactivity
// This is intentionally a client component to demonstrate potential hydration patterns
// In production, this could be optimized with server actions

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsSubmitting(true);
    // Navigate to results page with question as search param
    // TODO: This will be replaced with server actions or Ship AI Workflows
    router.push(`/?question=${encodeURIComponent(question)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !question.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}

