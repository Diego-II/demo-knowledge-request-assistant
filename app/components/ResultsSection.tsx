import { ResultsArea } from "./ResultsArea";

interface ResultsSectionProps {
  searchParams: Promise<{ question?: string }>;
}

export async function ResultsSection({
  searchParams,
}: ResultsSectionProps) {
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
