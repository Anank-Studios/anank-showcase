/** Concatena classes ignorando falsy. Sem dependência. */
export function cn(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
