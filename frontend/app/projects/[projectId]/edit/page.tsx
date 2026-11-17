import type { Metadata } from "next";
import { ProjectForm } from "@/components/project-form";
import { getProject } from "@/lib/api-client/projects";
import { orNotFound, parseRouteId } from "@/lib/route-helpers";
import { updateProjectAction } from "../../actions";

export const metadata: Metadata = { title: "Modifier le projet" };

export default async function EditProjectPage(props: PageProps<"/projects/[projectId]/edit">) {
  const { projectId } = await props.params;
  const id = parseRouteId(projectId);
  const project = await orNotFound(getProject(id));

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Modifier le projet</h1>
      <ProjectForm
        action={updateProjectAction.bind(null, project.id)}
        initialValues={{ name: project.name, description: project.description ?? "" }}
        cancelHref={`/projects/${project.id}`}
      />
    </>
  );
}
