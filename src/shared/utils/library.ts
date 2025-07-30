import { validateSync, ValidationError } from 'class-validator';

export function validateAndReturnErrors<T extends object>(
  instance: T,
): string[] {
  const errors: ValidationError[] = validateSync(instance, {
    skipMissingProperties: false,
    forbidUnknownValues: false,
  });

  return errors.length > 0 ? extractConstraintsErrors(errors) : [];
}

function extractConstraintsErrors(errors: ValidationError[]) {
  const errorMessages: string[] = [];

  function extractErrorsRecursive(error: ValidationError) {
    if (error.constraints) {
      for (const key in error.constraints) {
        errorMessages.push(error.constraints[key]);
      }
    }

    if (error.children) {
      error.children.forEach((child) => extractErrorsRecursive(child));
    }
  }

  errors.forEach((item) => extractErrorsRecursive(item));

  return errorMessages;
}
