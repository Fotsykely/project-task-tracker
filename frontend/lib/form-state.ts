import type { FieldErrors } from "./api-client/types";

// What the submitted fields contained, used to refill the form after an error.
export type FormValues = Record<string, string>;

// Result of a form Server Action, read by the form through useActionState.
// On success the action redirects, so the form only ever sees "idle" or "error".
export type FormState =
  | { status: "idle" }
  | { status: "error"; message: string | null; fieldErrors: FieldErrors; values: FormValues };

export const INITIAL_FORM_STATE: FormState = { status: "idle" };
