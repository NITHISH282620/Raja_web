/**
 * Lightweight JSON validation for admin saves.
 * Protects against prototype pollution and ensures basic structure.
 */

export function validateContent(collection: string, data: unknown): unknown {
  if (typeof data !== "object" || data === null) {
    throw new Error("Content must be an object");
  }

  // Prevent prototype pollution
  if ("__proto__" in data || "constructor" in data || "prototype" in data) {
    throw new Error("Invalid object keys detected");
  }

  // Ensure it's a plain record
  if (Array.isArray(data)) {
    throw new Error("Content cannot be an array at the root");
  }

  const record = data as Record<string, unknown>;

  // Basic collection-specific checks
  if (collection === "projects") {
    if (record.title && typeof record.title !== "string") throw new Error("Title must be a string");
    if (record.year && typeof record.year !== "number") throw new Error("Year must be a number");
  } else if (collection === "services") {
    if (record.name && typeof record.name !== "string") throw new Error("Name must be a string");
  } else if (collection === "inventory") {
    if (record.title && typeof record.title !== "string") throw new Error("Title must be a string");
  }

  return record;
}
