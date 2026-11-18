"use client";

import { useActionState } from "react";
import { ButtonLink } from "@/components/button";
import { FormError, InputField, SelectField } from "@/components/field";
import { SubmitButton } from "@/components/submit-button";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/api-client/types";
import { INITIAL_FORM_STATE, type FormState } from "@/lib/form-state";
import { STATUS_LABELS, PRIORITY_LABELS } from "@/lib/format";

type TaskFormValues = { title: string; status: string; dueDate: string; priority: string };

type TaskFormProps = {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  initialValues: TaskFormValues;
  submitLabel: string;
  // Only the edit page has a way back; the "add" form lives on the project page itself.
  cancelHref?: string;
};

// Used to add a task (project page) and to edit one (edit page). As for projects, the API validates
// and this form displays its messages under the matching field.
export function TaskForm({ action, initialValues, submitLabel, cancelHref }: TaskFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_FORM_STATE);

  const values = state.status === "error" ? state.values : initialValues;
  const fieldErrors = state.status === "error" ? state.fieldErrors : {};

  return (
    <form action={formAction} noValidate className="grid gap-4 sm:grid-cols-2">
      {state.status === "error" && state.message && (
        <div className="sm:col-span-2">
          <FormError>{state.message}</FormError>
        </div>
      )}

      <div className="sm:col-span-2">
        <InputField label="Titre" name="title" defaultValue={values.title} errors={fieldErrors.title} />
      </div>
      <SelectField label="Statut" name="status" defaultValue={values.status} errors={fieldErrors.status}>
        {TASK_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </SelectField>
      <SelectField label="Priorité" name="priority" defaultValue={values.priority} errors={fieldErrors.priority}>
        {TASK_PRIORITIES.map((priority) => (
          <option key={priority} value={priority}>
            {PRIORITY_LABELS[priority]}
          </option>
        ))}
      </SelectField>
      <InputField
        label="Échéance"
        name="dueDate"
        type="date"
        optional
        defaultValue={values.dueDate}
        errors={fieldErrors.dueDate}
      />

      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <SubmitButton>{submitLabel}</SubmitButton>
        {cancelHref && (
          <ButtonLink href={cancelHref} variant="secondary">
            Annuler
          </ButtonLink>
        )}
      </div>
    </form>
  );
}
