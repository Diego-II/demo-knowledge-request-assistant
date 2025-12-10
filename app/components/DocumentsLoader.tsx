// Server component that displays documents
// Wrapped in Suspense in the parent component
// Now receives documents as props from the workflow to avoid double-fetching

import { Document } from "@/lib/types/api";
import { DocumentList } from "./DocumentList";

interface DocumentsLoaderProps {
  documents: Document[];
  question: string;
}

export function DocumentsLoader({ documents, question }: DocumentsLoaderProps) {
  // Documents are now provided as props from the workflow execution
  // This avoids double-fetching and ensures consistency with the summary
  return <DocumentList documents={documents} question={question} />;
}

