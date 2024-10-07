export type EType = ESimpleType | EArrayType | EObjectType;
export type ESimpleType = "string" | "number" | "boolean" | "null";
export type EBaseType = ESimpleType | "array" | "object";
export type EArrayType = [EType];
export type EObjectType = { [K in string]: { type: EType; idx: number } };

export type EValue<T extends EType> = { value: any; type: T; valid?: boolean };
