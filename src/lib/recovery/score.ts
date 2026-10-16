export type Band = "High" | "Medium" | "Low";
export function scoreBand(score: number): Band {
  return score >= 80 ? "High" : score >= 60 ? "Medium" : "Low";
}
export const bandText: Record<Band, string> = { High: "text-success", Medium: "text-warning", Low: "text-destructive" };
