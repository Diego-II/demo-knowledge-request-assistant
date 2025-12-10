// Server component that fetches documents
// Wrapped in Suspense in the parent component
// TODO: Add cache() wrapper here for Next.js 16 caching
// TODO: This will be integrated with Ship AI Workflows for orchestration

import { fetchDocuments } from "@/lib/utils/api";
import { DocumentList } from "./DocumentList";

interface DocumentsLoaderProps {
  question: string;
}

export async function DocumentsLoader({ question }: DocumentsLoaderProps) {
  // This async operation will be wrapped in Suspense
  // TODO: Add cache() wrapper: const documents = await cache(() => fetchDocuments(question))();
  const documents = await fetchDocuments(question);

  return <DocumentList documents={documents} />;
}

