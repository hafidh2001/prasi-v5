import { FNCompDef } from "utils/types/meta-fn";

export const sortProp = (props: Record<string, FNCompDef>) => {
  const raw_entries = Object.entries(props);
  const sorted_entries = {} as Record<string, typeof raw_entries>;
  const entries = [] as typeof raw_entries;
  for (const [k, v] of Object.entries(props)) {
    if (k.includes("__")) {
      const group = k.split("__").shift() || "";
      if (!sorted_entries[group]) {
        sorted_entries[group] = [];
      }
      sorted_entries[group].push([k, v]);
    } else {
      if (!sorted_entries[""]) sorted_entries[""] = [];
      sorted_entries[""].push([k, v]);
    }
  }
  for (const [k, v] of Object.entries(sorted_entries)) {
    sorted_entries[k] = v.sort((a, b) => {
      if (a[0].endsWith("__") && !b[0].endsWith("__")) return -1;
      if (!a[0].endsWith("__") && b[0].endsWith("__")) return 1;
      if (!a[1]) return 0;
      if (!b[1]) return 0;
      return (a[1].idx || 0) - (b[1].idx || 0);
    });
  }
  if (sorted_entries[""]) {
    for (const v of sorted_entries[""]) {
      entries.push(v);
    }
  }

  for (const [k, v] of Object.entries(sorted_entries).sort((a, b) => {
    return (a[1][0][1].idx || 0) - (b[1][0][1].idx || 0);
  })) {
    if (k) {
      for (const item of v) {
        entries.push(item);
      }
    }
  }
  return entries;
};
