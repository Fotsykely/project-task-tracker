import type { TaskStatus } from "@/lib/api-client/types";
import { STATUS_LABELS } from "@/lib/format";

const STATUS_CLASSES: Record<TaskStatus, string> = {
  Todo: "bg-status-todo-bg text-status-todo-fg",
  InProgress: "bg-status-in-progress-bg text-status-in-progress-fg",
  Done: "bg-status-done-bg text-status-done-fg",
};

// A status pill. The text label is always shown: colour alone never carries the information.
export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
