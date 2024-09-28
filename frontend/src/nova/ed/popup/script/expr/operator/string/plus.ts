import { EOperatorType, EValue } from "../../lib/type";
export default {
  base: "string",
  syntax: "+",
  output: "string",
  process: function (a, b): EValue {
    const str_a = a.value === "string" ? a.value : a.value?.toString();
    const str_b = b.value === "string" ? b.value : b.value?.toString();
    return {
      type: "string",
      value: (str_a || "") + (str_b || ""),
    };
  },
} as EOperatorType;
