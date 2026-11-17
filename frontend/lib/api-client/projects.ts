import { apiFetch, apiFetchNoContent, jsonRequest } from "./client";
import type { Project, ProjectInput, ProjectSummary } from "./types";

export function listProjects(): Promise<ProjectSummary[]> {
  return apiFetch("/api/projects");
}

export function getProject(id: number): Promise<Project> {
  return apiFetch(`/api/projects/${id}`);
}

export function createProject(input: ProjectInput): Promise<Project> {
  return apiFetch("/api/projects", jsonRequest("POST", input));
}

export function updateProject(id: number, input: ProjectInput): Promise<Project> {
  return apiFetch(`/api/projects/${id}`, jsonRequest("PUT", input));
}

// Also deletes the tasks of the project (cascade in the database).
export function deleteProject(id: number): Promise<void> {
  return apiFetchNoContent(`/api/projects/${id}`, { method: "DELETE" });
}
