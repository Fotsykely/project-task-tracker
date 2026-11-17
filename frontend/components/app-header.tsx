import Link from "next/link";
import { Suspense } from "react";
import { Menu } from "lucide-react";
import { ProjectNav, ProjectNavSkeleton } from "@/components/project-nav";

// Mobile navigation: a top bar with a native <details> menu (no JavaScript needed), hidden from lg up.
export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface lg:hidden">
      <Link href="/" className="block px-4 py-3 text-lg font-semibold">
        Suivi de projets
      </Link>
      <details className="border-t border-border">
        <summary className="flex min-h-11 items-center gap-2 px-4 text-sm font-semibold">
          <Menu aria-hidden className="size-4" />
          Projets
        </summary>
        <div className="pt-1">
          <Suspense fallback={<ProjectNavSkeleton />}>
            <ProjectNav />
          </Suspense>
        </div>
      </details>
    </header>
  );
}
