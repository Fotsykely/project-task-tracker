"use server";

import { redirect } from "next/navigation";
import { ApiNotFoundError } from "@/lib/api-client/client";
import { createTask, deleteTask, getTask, updateTask } from "@/lib/api-client/tasks";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskInput,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/api-client/types";
import { readText } from "@/lib/form-data";
import { toFormState } from "@/lib/form-errors";
import type { FormState, FormValues } from "@/lib/form-state";
import { revalidateAllPages } from "@/lib/revalidate";

// Form field names, used to keep only the API messages that belong to this form.
const TASK_FIELDS = ["title", "status", "dueDate", "priority"] as const;

// Same shape as the project actions: read the form, call the API client, then redirect or return errors.

// Adds a task from the form on the project page. The form stays on the page: on success it is
// emptied (state "idle") and the refreshed task list shows the new task.
export async function createTaskAction(
  projectId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readTaskValues(formData);

  try {
    await createTask(projectId, toTaskInput(values));
  } catch (error) {
    return toFormState(error, TASK_FIELDS, values);
  }

  revalidateAllPages();
  return { status: "idle" };
}

export async function updateTaskAction(
  projectId: number,
  taskId: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = readTaskValues(formData);

  try {
    await updateTask(taskId, toTaskInput(values));
  } catch (error) {
    return toFormState(error, TASK_FIELDS, values);
  }

  revalidateAllPages();
  redirect(`/projects/${projectId}`);
}

// The API replaces the whole task on update, so the current title, priority and due date are read first.
export async function changeTaskStatusAction(taskId: number, formData: FormData): Promise<void> {
  const task = await getTask(taskId);
  const status = parseTaskStatus(readText(formData, "status")) ?? task.status;

  await updateTask(taskId, { title: task.title, status, dueDate: task.dueDate, priority: task.priority });
  revalidateAllPages();
}

export async function deleteTaskAction(taskId: number): Promise<void> {
  try {
    await deleteTask(taskId);
  } catch (error) {
    // Already deleted (for example in another tab): the goal is reached, so carry on.
    if (!(error instanceof ApiNotFoundError)) throw error;
  }

  revalidateAllPages();
}

function readTaskValues(formData: FormData): FormValues {
  return {
    title: readText(formData, "title"),
    status: readText(formData, "status"),
    dueDate: readText(formData, "dueDate"),
    priority: readText(formData, "priority"),
  };
}

function toTaskInput(values: FormValues): TaskInput {
  return {
    title: values.title,
    // The select only offers valid statuses; anything else can only come from a hand-made request.
    status: parseTaskStatus(values.status) ?? "Todo",
    dueDate: values.dueDate === "" ? null : values.dueDate,
    priority: parseTaskPriority(values.priority) ?? "Normal",
  };
}

function parseTaskStatus(rawStatus: string): TaskStatus | undefined {
  return TASK_STATUSES.find((status) => status === rawStatus);
}

function parseTaskPriority(rawPriority: string): TaskPriority | undefined {
  return TASK_PRIORITIES.find((priority) => priority === rawPriority);
}
