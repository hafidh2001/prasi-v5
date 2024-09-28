import { EArrayType, EObjectType, EType, EValue } from "./type";

type ValidationError = { path: string; expected: string; got: any };
type ValidationResult =
  | { status: "error"; error: ValidationError[] }
  | { status: "success" };

export function validateValue(
  value: EValue,
  expectedType: EType,
  path: string = "root"
): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof expectedType === "string") {
    switch (expectedType) {
      case "string":
        if (value.type !== "string" || typeof value.value !== "string") {
          errors.push({ path, expected: expectedType, got: value.type });
        }
        break;
      case "number":
        if (value.type !== "number" || typeof value.value !== "number") {
          errors.push({ path, expected: expectedType, got: value.type });
        }
        break;
      case "boolean":
        if (value.type !== "boolean" || typeof value.value !== "boolean") {
          errors.push({ path, expected: expectedType, got: value.type });
        }
        break;
      case "null":
        if (value.type !== "null" || value.value !== null) {
          errors.push({ path, expected: expectedType, got: value.type });
        }
        break;
      default:
        errors.push({ path, expected: expectedType, got: "unknown" });
    }
  } else if (Array.isArray(expectedType) && expectedType.length === 1) {
    const expectedArrayType = (expectedType as EArrayType)[0];

    if (!Array.isArray(value.value)) {
      errors.push({ path, expected: "array", got: value.type });
    } else {
      value.value.forEach((item, index) => {
        const result = validateValue(
          item,
          expectedArrayType,
          `${path}.${index}`
        );
        if (result.status === "error") {
          errors.push(...result.error);
        }
      });
    }
  } else if (typeof expectedType === "object") {
    const expectedObjectType = expectedType as EObjectType;

    // Assert that value.value is an object
    if (typeof value.value === "object" && value.value !== null) {
      for (const key in expectedObjectType) {
        const expectedValueType = expectedObjectType[key].type;
        const valueForKey = value.value as { [key: string]: EValue }; // assert as a string-indexable object

        if (!(key in valueForKey)) {
          errors.push({
            path: `${path}.${key}`,
            expected: "property",
            got: "missing",
          });
        } else {
          const result = validateValue(
            valueForKey[key],
            expectedValueType,
            `${path}.${key}`
          );
          if (result.status === "error") {
            errors.push(...result.error);
          }
        }
      }
    } else {
      errors.push({ path, expected: "object", got: typeof value.value });
    }
  }

  return errors.length > 0
    ? { status: "error", error: errors }
    : { status: "success" };
}
