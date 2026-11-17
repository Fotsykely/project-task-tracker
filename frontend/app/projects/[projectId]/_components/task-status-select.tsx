"use client";

import { useRef } from "react";
import { TASK_STATUSES, type TaskStatus } from "@/lib/api-client/types";
import { STATUS_LABELS } from "@/lib/format";

type TaskStatusSelectProps = {
  taskTitle: string;
  currentStatus: TaskStatus;
  // Server Action bound to the task id; it reads the new "status" from the form.
  action: (formData: FormData) => Promise<void>;
};

// Changes a task's status in one step: picking another option submits the form straight away.
export function TaskStatusSelect({ taskTitle, currentStatus, action }: TaskStatusSelectProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <select
        name="status"
        defaultValue={currentStatus}
        aria-label={`Statut de la tâche « ${taskTitle} »`}
        onChange={() => formRef.current?.requestSubmit()}
        className="min-h-11 rounded-md border border-border-input bg-surface px-3 text-sm"
      >
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </form>
  );
}
