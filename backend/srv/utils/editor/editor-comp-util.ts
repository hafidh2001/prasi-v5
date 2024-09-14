import { editor } from ".";

export const registerCompConnections = (
  comp_ids: string[],
  conn_id: string
) => {
  for (const id of comp_ids) {
    if (!editor.comp.comp_ids[id]) {
      editor.comp.comp_ids[id] = new Set();
    }
    editor.comp.comp_ids[id].add(conn_id);
  }
  if (!editor.comp.conn_ids[conn_id]) {
    editor.comp.conn_ids[conn_id] = new Set(comp_ids);
  } else {
    editor.comp.conn_ids[conn_id] = editor.comp.conn_ids[conn_id].union(
      new Set(comp_ids)
    );
  }
};

export const unregisterCompConnection = (conn_id: string) => {
  editor.comp.conn_ids[conn_id]?.forEach((comp_id) => {
    editor.comp.comp_ids[comp_id]?.delete(conn_id);
    if (editor.comp.comp_ids[comp_id].size === 0) {
      delete editor.comp.comp_ids[comp_id];
    }
  });
};
