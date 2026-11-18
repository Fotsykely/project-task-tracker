import type { TaskPriority } from "@/lib/api-client/types";
import { PRIORITY_LABELS } from "@/lib/format";

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  Low: "bg-priority-low-bg text-priority-low-fg",
  Normal: "bg-priority-normal-bg text-priority-normal-fg",
  High: "bg-priority-high-bg text-priority-high-fg",
};

// A priority pill. The text label is always shown: colour alone never carries the information.
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold ${PRIORITY_CLASSES[priority]}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
