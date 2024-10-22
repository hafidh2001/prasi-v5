import { editor } from ".";

export type EditorCompSingleCache = {
  id: string;
  content_tree: any;
  id_component_group: string;
};
export const editorCompLoad = async (comp_ids: string[]) => {
  const load_comp_ids = new Set<string>();
  const result: Record<string, EditorCompSingleCache> = {};

  const existing = editor.cache.tables.comp.find({
    where: `comp_id in (${comp_ids.map((e) => `'${e}'`).join(",")})`,
  });

  for (const id of comp_ids) {
    const found = existing.find((e) => e.comp_id === id);
    if (!found) {
      load_comp_ids.add(id);
    } else {
      result[id] = found.data;
    }
  }

  if (load_comp_ids.size === 0) {
    return result;
  }

  const comps = await _db.component.findMany({
    where: { id: { in: [...load_comp_ids] } },
    select: {
      id: true,
      id_component_group: true,
      content_tree: true,
    },
  });
  for (const comp of comps) {
    editor.cache.tables.comp.save({
      comp_id: comp.id,
      data: comp,
      ts: Date.now(),
    });
    result[comp.id] = comp as any;
  }
  return result;
};
