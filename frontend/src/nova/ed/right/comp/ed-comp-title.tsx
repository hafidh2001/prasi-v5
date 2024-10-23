import { active } from "logic/active";

export const EdCompTitle = () => {
  const comp = active.comp;
  if (!comp) return null;

  return <div className="flex items-center">{comp.snapshot.name}</div>;
};
