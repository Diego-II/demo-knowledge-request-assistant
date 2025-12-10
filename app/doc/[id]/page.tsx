import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocumentById } from "@/lib/utils/api-server";

interface DocumentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ question?: string }>;
}

export default async function DocumentPage({
  params,
  searchParams,
}: DocumentPageProps) {
  const { id } = await params;
  const { question } = await searchParams;
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  const backHref = question
    ? `/?question=${encodeURIComponent(question)}`
    : "/";
  const backText = question ? "← Back to Retrieved Docs" : "← Back to Home";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          {backText}
        </Link>

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {document.title}
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {Math.round(document.relevanceScore * 100)}% relevant
                </span>
                <span className="text-sm text-gray-500">ID: {document.id}</span>
              </div>
            </div>
          </div>

          <div className="mb-6 border-t border-gray-200 pt-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Content
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">
                {document.content}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500">Source</h3>
            <a
              href={document.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {document.source}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
