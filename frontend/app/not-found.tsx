import { ButtonLink } from "@/components/button";

// Shown for unknown URLs and whenever a page calls notFound() (unknown project or task).
export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="text-muted-foreground">Ce projet ou cette tâche n&apos;existe pas (ou a été supprimé).</p>
      <ButtonLink href="/">Retour aux projets</ButtonLink>
    </div>
  );
}
