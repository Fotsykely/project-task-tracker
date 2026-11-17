import Link from "next/link";
import type { ProjectSummary } from "@/lib/api-client/types";
import { formatDate, formatTaskCount } from "@/lib/format";

// A project on the home page. The whole card is the link.
export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-lg border border-border bg-surface p-4 shadow-sm transition-colors hover:border-primary"
    >
      <h2 className="break-words font-semibold">{project.name}</h2>
      {project.description && (
        <p className="mt-1 line-clamp-2 break-words text-sm text-muted-foreground">{project.description}</p>
      )}
      <p className="mt-3 flex flex-wrap gap-x-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{formatTaskCount(project.taskCount)}</span>
        <span>Créé le {formatDate(project.createdAt)}</span>
      </p>
    </Link>
  );
}
