export type VString = { type: "string"; value: string };
export type VNumber = { type: "number"; value: number };
export type VBoolean = { type: "boolean"; value: boolean };
export type VNull = { type: "null"; value: null };
export type VArray = { type: "array"; value: VPrimitive[] };
export type VObject = { type: "object"; value: { [key: string]: VPrimitive } };

export type VPrimitive = VArray | VString | VNumber | VBoolean | VNull;
