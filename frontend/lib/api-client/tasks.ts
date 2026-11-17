import { apiFetch, apiFetchNoContent, jsonRequest } from "./client";
import type { Task, TaskInput } from "./types";

export function listTasks(projectId: number): Promise<Task[]> {
  return apiFetch(`/api/projects/${projectId}/tasks`);
}

export function getTask(id: number): Promise<Task> {
  return apiFetch(`/api/tasks/${id}`);
}

export function createTask(projectId: number, input: TaskInput): Promise<Task> {
  return apiFetch(`/api/projects/${projectId}/tasks`, jsonRequest("POST", input));
}

export function updateTask(id: number, input: TaskInput): Promise<Task> {
  return apiFetch(`/api/tasks/${id}`, jsonRequest("PUT", input));
}

export function deleteTask(id: number): Promise<void> {
  return apiFetchNoContent(`/api/tasks/${id}`, { method: "DELETE" });
}
