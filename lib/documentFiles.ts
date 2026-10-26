import { db } from "@/db";
import { documentFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

/** Stays under Vercel's 4.5 MB request body limit. */
export const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;

export const ALLOWED_DOCUMENT_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Returns an error message, or null when the file can be stored. */
export function validateDocumentFile(file: File | null): string | null {
  if (!file || file.size === 0) return "Please choose a file to upload.";
  if (!ALLOWED_DOCUMENT_TYPES[file.type]) return "Only PDF, JPG, PNG or WEBP files are accepted.";
  if (file.size > MAX_DOCUMENT_BYTES) return "File is too large. The maximum size is 4 MB.";
  return null;
}

export async function saveDocumentFile(documentId: string, file: File) {
  const dataBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const values = {
    documentId,
    fileName: file.name.slice(0, 200),
    mimeType: file.type,
    sizeBytes: file.size,
    dataBase64,
  };

  await db
    .insert(documentFiles)
    .values(values)
    .onConflictDoUpdate({
      target: documentFiles.documentId,
      set: { ...values, createdAt: new Date() },
    });
}

/** Streams a stored file back, or a 404 when the document has no file. */
export async function documentFileResponse(documentId: string, download: boolean): Promise<Response> {
  const rows = await db.select().from(documentFiles).where(eq(documentFiles.documentId, documentId));
  const file = rows[0];
  if (!file) {
    return Response.json({ error: "No file has been uploaded for this document." }, { status: 404 });
  }

  const safeName = file.fileName.replace(/[^\w.\- ]/g, "_");
  return new Response(Buffer.from(file.dataBase64, "base64"), {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Length": String(file.sizeBytes),
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${safeName}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
