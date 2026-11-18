import { Calendar, Pencil, TriangleAlert } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { ConfirmDelete } from "@/components/confirm-delete";
import type { Task } from "@/lib/api-client/types";
import { formatDate, isOverdue } from "@/lib/format";
import { changeTaskStatusAction, deleteTaskAction } from "../task-actions";
import { PriorityBadge } from "./priority-badge";
import { statusRowClasses } from "./status-badge";
import { TaskStatusSelect } from "./task-status-select";

// One task: title, then priority and due date on the left; status, edit and delete on the right
// (below the text on narrow screens).
export function TaskRow({ task }: { task: Task }) {
  const editHref = `/projects/${task.projectId}/tasks/${task.id}/edit`;

  return (
    <li
      className={`flex flex-col gap-3 rounded-lg border border-l-4 border-border ${statusRowClasses(task.status)} p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="min-w-0">
        <p className="break-words font-medium">{task.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && <DueDate dueDate={task.dueDate} overdue={isOverdue(task.dueDate, task.status)} />}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <TaskStatusSelect
          taskTitle={task.title}
          currentStatus={task.status}
          action={changeTaskStatusAction.bind(null, task.id)}
        />
        <ButtonLink href={editHref} variant="secondary" aria-label={`Modifier la tâche « ${task.title} »`}>
          <Pencil aria-hidden className="size-4" />
        </ButtonLink>
        <ConfirmDelete
          iconOnly
          triggerLabel={`Supprimer la tâche « ${task.title} »`}
          title="Supprimer cette tâche ?"
          description={`« ${task.title} » sera définitivement supprimée.`}
          confirmLabel="Supprimer la tâche"
          action={deleteTaskAction.bind(null, task.id)}
        />
      </div>
    </li>
  );
}

// A late task is flagged with a text and an icon, not with colour alone.
function DueDate({ dueDate, overdue }: { dueDate: string; overdue: boolean }) {
  const Icon = overdue ? TriangleAlert : Calendar;

  return (
    <p className={`flex items-center gap-1.5 text-sm ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
      <Icon aria-hidden className="size-4 shrink-0" />
      Échéance : {formatDate(dueDate)}
      {overdue && <strong className="font-semibold"> · En retard</strong>}
    </p>
  );
}
