import { Pencil } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { ConfirmDelete } from "@/components/confirm-delete";
import { getProject } from "@/lib/api-client/projects";
import { listTasks } from "@/lib/api-client/tasks";
import { TASK_STATUSES } from "@/lib/api-client/types";
import { formatDate, formatTaskCount } from "@/lib/format";
import { orNotFound, parseRouteId } from "@/lib/route-helpers";
import { deleteProjectAction } from "../actions";
import { TaskForm } from "./_components/task-form";
import { TaskGroup } from "./_components/task-group";
import { createTaskAction } from "./task-actions";

export default async function ProjectPage(props: PageProps<"/projects/[projectId]">) {
  const { projectId } = await props.params;
  const id = parseRouteId(projectId);

  // Both requests start together instead of one after the other.
  const [project, tasks] = await Promise.all([orNotFound(getProject(id)), orNotFound(listTasks(id))]);

  // One group per status, in workflow order; empty groups are left out.
  const groups = TASK_STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((task) => task.status === status),
  })).filter((group) => group.tasks.length > 0);

  return (
    <>
      <header className="mb-8 flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Créé le {formatDate(project.createdAt)} · {formatTaskCount(tasks.length)}
          </p>
          {project.description && <p className="mt-3 whitespace-pre-line break-words">{project.description}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/projects/${project.id}/edit`} variant="secondary">
            <Pencil aria-hidden className="size-4" />
            Modifier
          </ButtonLink>
          <ConfirmDelete
            triggerLabel="Supprimer"
            title="Supprimer ce projet ?"
            description={`« ${project.name} » et toutes ses tâches seront définitivement supprimés.`}
            confirmLabel="Supprimer le projet"
            action={deleteProjectAction.bind(null, project.id)}
          />
        </div>
      </header>

      <section aria-labelledby="add-task-heading" className="mb-8 rounded-lg border border-border bg-surface p-4">
        <h2 id="add-task-heading" className="mb-4 text-lg font-semibold">
          Ajouter une tâche
        </h2>
        <TaskForm
          action={createTaskAction.bind(null, project.id)}
          initialValues={{ title: "", status: "Todo", dueDate: "" }}
          submitLabel="Ajouter la tâche"
        />
      </section>

      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="mb-4 text-lg font-semibold">
          Tâches
        </h2>
        {groups.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border-input p-6 text-center text-muted-foreground">
            Aucune tâche pour le moment. Ajoutez la première avec le formulaire ci-dessus.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <TaskGroup key={group.status} status={group.status} tasks={group.tasks} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
