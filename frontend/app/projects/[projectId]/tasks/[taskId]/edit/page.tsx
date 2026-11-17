import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTask } from "@/lib/api-client/tasks";
import { orNotFound, parseRouteId } from "@/lib/route-helpers";
import { TaskForm } from "../../../_components/task-form";
import { updateTaskAction } from "../../../task-actions";

export const metadata: Metadata = { title: "Modifier la tâche" };

export default async function EditTaskPage(props: PageProps<"/projects/[projectId]/tasks/[taskId]/edit">) {
  const { projectId, taskId } = await props.params;
  const projectNumber = parseRouteId(projectId);
  const task = await orNotFound(getTask(parseRouteId(taskId)));

  // The URL must name the project the task really belongs to.
  if (task.projectId !== projectNumber) notFound();

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Modifier la tâche</h1>
      <TaskForm
        action={updateTaskAction.bind(null, projectNumber, task.id)}
        initialValues={{ title: task.title, status: task.status, dueDate: task.dueDate ?? "" }}
        submitLabel="Enregistrer"
        cancelHref={`/projects/${projectNumber}`}
      />
    </>
  );
}
