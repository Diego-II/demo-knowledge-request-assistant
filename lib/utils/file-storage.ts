import { promises as fs } from "fs";
import path from "path";

export interface SavedDocument {
  id: string;
  question: string;
  originalSummary: string;
  humanRevision?: string;
  appendix: string;
  createdAt: string;
  filePath: string;
}

const SAVED_DOCUMENTS_DIR = path.join(process.cwd(), "data", "saved-documents");
const SAVED_DOCUMENTS_INDEX = path.join(SAVED_DOCUMENTS_DIR, "index.json");

// Ensure the saved documents directory exists
async function ensureDirectoryExists() {
  try {
    await fs.mkdir(SAVED_DOCUMENTS_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }
}

// Load the index of saved documents
export async function loadSavedDocumentsIndex(): Promise<SavedDocument[]> {
  try {
    await ensureDirectoryExists();
    const indexContent = await fs.readFile(SAVED_DOCUMENTS_INDEX, "utf-8");
    return JSON.parse(indexContent);
  } catch (error) {
    // Index doesn't exist yet, return empty array
    return [];
  }
}

// Save a document to disk and update the index
export async function saveDocument(document: SavedDocument): Promise<void> {
  await ensureDirectoryExists();

  // Save the document content to a file
  const filePath = path.join(SAVED_DOCUMENTS_DIR, `${document.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(document, null, 2), "utf-8");

  // Update the index
  const index = await loadSavedDocumentsIndex();
  const existingIndex = index.findIndex((doc) => doc.id === document.id);
  
  if (existingIndex >= 0) {
    index[existingIndex] = { ...document, filePath };
  } else {
    index.push({ ...document, filePath });
  }

  // Sort by createdAt descending (newest first)
  index.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  await fs.writeFile(SAVED_DOCUMENTS_INDEX, JSON.stringify(index, null, 2), "utf-8");
}

// Get a saved document by ID
export async function getSavedDocument(id: string): Promise<SavedDocument | null> {
  try {
    const filePath = path.join(SAVED_DOCUMENTS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}
