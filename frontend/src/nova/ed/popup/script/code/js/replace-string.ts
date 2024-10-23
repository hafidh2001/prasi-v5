export function replaceString(
  originalText: string,
  replacements: Array<{ start: number; end: number; replacement: string }>
): string {
  // Convert the original text into an array of characters
  const textArray = originalText.split("");

  // Sort replacements by start position
  replacements.sort((a, b) => a.start - b.start);

  // Apply replacements in reverse order to manage overlapping issues but keep outer dominance
  for (const replace of replacements.reverse()) {
    const { start, end, replacement } = replace;

    // Verify if indices are within bounds
    if (start < 0 || end > textArray.length || start >= end) {
      console.error(originalText, replace);
      throw new Error("Invalid start or end positions.");
    }

    // Perform the replacement
    textArray.splice(start, end - start, ...replacement.split(""));
  }

  return textArray.join("");
}
