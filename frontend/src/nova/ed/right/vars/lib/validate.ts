import { EBaseType, ESimpleType, EType } from "./type";

interface ValidationResult {
  valid: boolean;
  errorMessage?: string;
}

export const getBaseType = (type: EType): EBaseType => {
  if (typeof type === "object") {
    if (Array.isArray(type)) {
      return "array";
    }
    return "object";
  }
  return type;
};

export function validateValue<T extends EType>(
  value: any,
  type: T,
  path: string = "value"
): ValidationResult {
  switch (type) {
    case "string":
      if (typeof value === "string") {
        return { valid: true };
      } else {
        return { valid: false, errorMessage: `${path} must be a string` };
      }
    case "number":
      if (typeof value === "number") {
        return { valid: true };
      } else {
        return { valid: false, errorMessage: `${path} must be a number` };
      }
    case "boolean":
      if (typeof value === "boolean") {
        return { valid: true };
      } else {
        return { valid: false, errorMessage: `${path} must be a boolean` };
      }
    case "null":
      if (value === null) {
        return { valid: true };
      } else {
        return { valid: false, errorMessage: `${path} must be null` };
      }
    default:
      // If type is an array of types
      if (Array.isArray(type) && type.length === 1) {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const result = validateValue(value[i], type[0], `${path}[${i}]`);
            if (!result.valid) {
              return result;
            }
          }
          return { valid: true };
        } else {
          return { valid: false, errorMessage: `${path} must be an array` };
        }
      } else if (typeof type === "object") {
        // Ensure type is correctly defined for object validation
        if (
          value !== null &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          for (const key in type) {
            if (type.hasOwnProperty(key)) {
              const property = type[key];

              if (
                typeof property === "object" &&
                property &&
                "type" in property
              ) {
                const propertyType = property.type as EType;
                const result = validateValue(
                  value[key],
                  propertyType,
                  `${path}.${key}`
                );
                if (!result.valid) {
                  return result;
                }
              } else {
                return {
                  valid: false,
                  errorMessage: `${path}.${key} is missing 'type' property`,
                };
              }
            }
          }
          return { valid: true };
        } else {
          return { valid: false, errorMessage: `${path} must be an object` };
        }
      }

      return { valid: false, errorMessage: `${path} is of unsupported type` };
  }
}
