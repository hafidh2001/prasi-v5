import { EPage } from "../../ed/logic/types";
import { base } from "./base";

export const loadPages = async (ids: string[]) => {
  const result = {} as Record<string, EPage["content_tree"]>;

  const res = (await (
    await fetch(base.url`_prasi/pages`, {
      method: "POST",
      body: JSON.stringify({ ids }),
    })
  ).json()) as {
    id: string;
    url: string;
    root: EPage["content_tree"];
  }[];

  for (const page of res) {
    result[page.id] = page.root;
  }

  return result;
};
