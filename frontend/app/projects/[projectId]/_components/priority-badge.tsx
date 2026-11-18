import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";
import type { TaskPriority } from "@/lib/api-client/types";
import { PRIORITY_LABELS } from "@/lib/format";

// Each priority has its own colour and its own icon, so the level is readable without relying on colour.
const PRIORITY_STYLES: Record<TaskPriority, { classes: string; Icon: LucideIcon }> = {
  Low: { classes: "bg-priority-low-bg text-priority-low-fg", Icon: ArrowDown },
  Normal: { classes: "bg-priority-normal-bg text-priority-normal-fg", Icon: Minus },
  High: { classes: "bg-priority-high-bg text-priority-high-fg", Icon: ArrowUp },
};

// A priority pill. The text label is always shown, and screen readers also hear what it refers to.
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { classes, Icon } = PRIORITY_STYLES[priority];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-semibold ${classes}`}>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      <span className="sr-only">Priorité : </span>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
