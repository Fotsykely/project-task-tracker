// These types mirror the DTOs of the ASP.NET Core API (backend/TaskTracker.Api/Dtos).
// When a DTO changes, update the matching type here.

export const TASK_STATUSES = ["Todo", "InProgress", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["Low", "Normal", "High"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

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
  priority: TaskPriority;
  dueDate: string | null; // "2026-12-31"
  projectId: number;
}

// Request bodies. An empty description is turned into "no description" by the API.
export type ProjectInput = {
  name: string;
  description: string;
};

export type TaskInput = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
};

// Validation messages per form field, with camelCase field names: { name: ["Le nom est obligatoire."] }
export type FieldErrors = Record<string, string[]>;
