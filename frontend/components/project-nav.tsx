import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { listProjects } from "@/lib/api-client/projects";
import type { ProjectSummary } from "@/lib/api-client/types";

// The list of projects shown in the sidebar (desktop) and in the menu (mobile).
// It sits in the root layout, so a failing API must not break every page: show a message instead.
export async function ProjectNav() {
  const projects = await loadProjects();

  return (
    <nav aria-label="Projets" className="flex flex-col gap-3 px-3 pb-4">
      <ButtonLink href="/projects/new">
        <Plus aria-hidden className="size-4" />
        Nouveau projet
      </ButtonLink>
      {projects === null ? (
        <p className="px-1 text-sm text-muted-foreground">Impossible de charger les projets.</p>
      ) : (
        <ProjectLinks projects={projects} />
      )}
    </nav>
  );
}

function ProjectLinks({ projects }: { projects: ProjectSummary[] }) {
  if (projects.length === 0) {
    return <p className="px-1 text-sm text-muted-foreground">Aucun projet pour le moment.</p>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/projects/${project.id}`}
            className="block truncate rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary-subtle"
          >
            {project.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function loadProjects(): Promise<ProjectSummary[] | null> {
  try {
    return await listProjects();
  } catch (error) {
    // Let Next.js handle its own internal errors (e.g. the prerender interruption) untouched.
    unstable_rethrow(error);
    console.error("Could not load the projects for the navigation.", error);
    return null;
  }
}

// Placeholder shown while the list loads, with the same footprint to avoid a layout shift.
export function ProjectNavSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-3 px-3 pb-4">
      <div className="h-11 rounded-md bg-border" />
      <div className="h-9 rounded-md bg-border" />
      <div className="h-9 rounded-md bg-border" />
      <div className="h-9 rounded-md bg-border" />
    </div>
  );
}
