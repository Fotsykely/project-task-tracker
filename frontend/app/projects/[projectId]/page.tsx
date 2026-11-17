import { Pencil } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { ConfirmDelete } from "@/components/confirm-delete";
import { getProject } from "@/lib/api-client/projects";
import { formatDate } from "@/lib/format";
import { orNotFound, parseRouteId } from "@/lib/route-helpers";
import { deleteProjectAction } from "../actions";

export default async function ProjectPage(props: PageProps<"/projects/[projectId]">) {
  const { projectId } = await props.params;
  const id = parseRouteId(projectId);
  const project = await orNotFound(getProject(id));

  return (
    <>
      <header className="mb-8 flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-semibold">{project.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Créé le {formatDate(project.createdAt)}</p>
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
    </>
  );
}
