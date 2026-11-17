import type { Metadata } from "next";
import { ProjectForm } from "@/components/project-form";
import { createProjectAction } from "../actions";

export const metadata: Metadata = { title: "Nouveau projet" };

export default function NewProjectPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Nouveau projet</h1>
      <ProjectForm action={createProjectAction} initialValues={{ name: "", description: "" }} cancelHref="/" />
    </>
  );
}
