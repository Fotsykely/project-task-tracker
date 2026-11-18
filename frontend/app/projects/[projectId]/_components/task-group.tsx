import type { Task, TaskStatus } from "@/lib/api-client/types";
import { StatusBadge } from "./status-badge";
import { TaskRow } from "./task-row";

// The tasks of one status, under a heading made of the status pill and the task count.
// A status appears once per page, so it is a unique id for the heading.
export function TaskGroup({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const headingId = `tasks-${status}`;

  const sortedTasks = tasks.toSorted(compareByDueDate);

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-2 flex items-center gap-2">
        <StatusBadge status={status} />
        <span className="text-sm text-muted-foreground">{tasks.length}</span>
      </h3>
      <ul className="flex flex-col gap-2">
        {sortedTasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
}

// Earliest due date first, tasks without a due date last. Dates are "YYYY-MM-DD" strings,
// so comparing them as text gives the chronological order. Equal dates keep their original order.
function compareByDueDate(a: Task, b: Task): number {
  if (a.dueDate === b.dueDate) return 0;
  if (a.dueDate === null) return 1;
  if (b.dueDate === null) return -1;
  return a.dueDate.localeCompare(b.dueDate);
}
