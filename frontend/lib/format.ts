import type { TaskStatus } from "./api-client/types";

// Texts shown to users stay in French; identifiers and comments stay in English.
export const STATUS_LABELS: Record<TaskStatus, string> = {
  Todo: "À faire",
  InProgress: "En cours",
  Done: "Terminée",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

// Accepts a full ISO date and time ("2026-11-17T15:39:33Z") or a plain date ("2026-12-31").
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate.length === 10 ? `${isoDate}T00:00:00` : isoDate));
}

// In French, zero is singular: "0 tâche", "1 tâche", "2 tâches".
export function formatTaskCount(count: number): string {
  return `${count} tâche${count > 1 ? "s" : ""}`;
}

// A task is late when its due day is before today and it is not done yet.
export function isOverdue(dueDate: string | null, status: TaskStatus): boolean {
  if (dueDate === null || status === "Done") return false;
  return dueDate < todayAsIsoDate();
}

function todayAsIsoDate(): string {
  // The "en-CA" locale formats dates as YYYY-MM-DD, in the local time zone.
  return new Date().toLocaleDateString("en-CA");
}
