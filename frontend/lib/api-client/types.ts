// These types mirror the DTOs of the ASP.NET Core API (backend/TaskTracker.Api/Dtos).
// When a DTO changes, update the matching type here.

export const TASK_STATUSES = ["Todo", "InProgress", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface ProjectSummary {
  id: number;
  name: string;
  description: string | null;
  createdAt: string; // ISO 8601 date and time
  taskCount: number;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  dueDate: string | null; // "2026-12-31"
  projectId: number;
}

// Request bodies. An empty description is turned into "no description" by the API.
export interface ProjectInput {
  name: string;
  description: string;
}

export interface TaskInput {
  title: string;
  status: TaskStatus;
  dueDate: string | null;
}
