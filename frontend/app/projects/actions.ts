"use server";

import { redirect } from "next/navigation";
import { ApiNotFoundError } from "@/lib/api-client/client";
import { createProject, deleteProject, updateProject } from "@/lib/api-client/projects";
import type { Project, ProjectInput } from "@/lib/api-client/types";
import { readText } from "@/lib/form-data";
import { toFormState } from "@/lib/form-errors";
import type { FormState } from "@/lib/form-state";
import { revalidateAllPages } from "@/lib/revalidate";

// Form field names, used to keep only the API messages that belong to this form.
const PROJECT_FIELDS = ["name", "description"] as const;

// These actions stay thin: read the form, call the API client, then redirect or return the errors.
// redirect() works by throwing, so it is always called outside the try/catch blocks.

export async function createProjectAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const input = readProjectInput(formData);

  let project: Project;
  try {
    project = await createProject(input);
  } catch (error) {
    return toFormState(error, PROJECT_FIELDS, input);
  }

  revalidateAllPages();
  redirect(`/projects/${project.id}`);
}

// Bound to the project id by the edit page: updateProjectAction.bind(null, project.id).
export async function updateProjectAction(
  projectId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const input = readProjectInput(formData);

  try {
    await updateProject(projectId, input);
  } catch (error) {
    return toFormState(error, PROJECT_FIELDS, input);
  }

  revalidateAllPages();
  redirect(`/projects/${projectId}`);
}

export async function deleteProjectAction(projectId: number): Promise<void> {
  try {
    await deleteProject(projectId);
  } catch (error) {
    // Already deleted (for example in another tab): the goal is reached, so carry on.
    if (!(error instanceof ApiNotFoundError)) throw error;
  }

  revalidateAllPages();
  redirect("/");
}

function readProjectInput(formData: FormData): ProjectInput {
  return {
    name: readText(formData, "name"),
    description: readText(formData, "description"),
  };
}
