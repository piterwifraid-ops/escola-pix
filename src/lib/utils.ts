// src/lib/utils.ts
// Utilitário para concatenar classes CSS condicionalmente
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}
