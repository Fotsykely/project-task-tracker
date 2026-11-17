"use client";

import { useActionState } from "react";
import { ButtonLink } from "@/components/button";
import { FormError, InputField, TextAreaField } from "@/components/field";
import { SubmitButton } from "@/components/submit-button";
import type { ProjectInput } from "@/lib/api-client/types";
import { INITIAL_FORM_STATE, type FormState } from "@/lib/form-state";

type ProjectFormProps = {
  action: (previousState: FormState, formData: FormData) => Promise<FormState>;
  initialValues: ProjectInput;
  cancelHref: string;
};

// Shared by the "new project" and "edit project" pages. The API validates; this form only displays
// the messages it sends back under the matching field (noValidate turns the browser's own checks off).
export function ProjectForm({ action, initialValues, cancelHref }: ProjectFormProps) {
  const [state, formAction] = useActionState(action, INITIAL_FORM_STATE);

  const values = state.status === "error" ? state.values : initialValues;
  const fieldErrors = state.status === "error" ? state.fieldErrors : {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.status === "error" && state.message && <FormError>{state.message}</FormError>}

      <InputField label="Nom" name="name" defaultValue={values.name} errors={fieldErrors.name} />
      <TextAreaField
        label="Description"
        name="description"
        optional
        defaultValue={values.description}
        errors={fieldErrors.description}
      />

      <div className="flex flex-wrap gap-3">
        <SubmitButton>Enregistrer</SubmitButton>
        <ButtonLink href={cancelHref} variant="secondary">
          Annuler
        </ButtonLink>
      </div>
    </form>
  );
}
