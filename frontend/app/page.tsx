import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { listProjects } from "@/lib/api-client/projects";
import { ProjectCard } from "./_components/project-card";

export default async function HomePage() {
  const projects = await listProjects();

  return (
    <>
      <header className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Projets</h1>
        <ButtonLink href="/projects/new">
          <Plus aria-hidden className="size-4" />
          Nouveau projet
        </ButtonLink>
      </header>

      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-input p-6 text-center text-muted-foreground">
          Aucun projet pour le moment. Créez le premier avec le bouton « Nouveau projet ».
        </p>
      ) : (
        <ul className="grid gap-3">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
