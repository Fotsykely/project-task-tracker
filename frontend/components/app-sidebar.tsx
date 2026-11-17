import Link from "next/link";
import { Suspense } from "react";
import { ProjectNav, ProjectNavSkeleton } from "@/components/project-nav";

// Desktop navigation: fixed column on the left, hidden below the lg breakpoint.
export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface lg:flex">
      <Link href="/" className="px-6 py-5 text-lg font-semibold">
        Suivi de projets
      </Link>
      <Suspense fallback={<ProjectNavSkeleton />}>
        <ProjectNav />
      </Suspense>
    </aside>
  );
}
