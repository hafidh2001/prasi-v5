import { component_group } from "prasi-db";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Menu, MenuItem } from "../../../../utils/ui/context-menu";
import { Loading } from "../../../../utils/ui/loading";
import { EDGlobal } from "../../logic/ed-global";

export const EdPopCompGroup = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const local = useLocal({ groups: [] as component_group[] }, async () => {
    local.groups = await _db.component_group.findMany({
      where: {
        component_site: { some: { id_site: p.site.id } },
      },
    });
    local.render();
  });

  const pop = p.ui.popup.comp_group;

  if (!pop.mouse_event) return null;

  return (
    <Menu
      mouseEvent={pop.mouse_event}
      onClose={() => {
        p.ui.popup.comp_group.mouse_event = null;
        p.render();
        if (pop.on_close) pop.on_close();
      }}
    >
      <MenuItem
        disabled
        label={
          local.groups.length === 0 ? (
            <div className="bg-white relative  w-[150px] h-[20px]">
              <div className="absolute inset-0 -mx-[10px] -my-[2px]">
                <Loading />
              </div>
            </div>
          ) : (
            <div className="text-slate-500">Choose Component Group:</div>
          )
        }
      />
      {local.groups
        .filter((g) => g.name !== "__TRASH__")
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((g) => (
          <MenuItem
            onClick={() => {
              p.ui.popup.comp_group?.on_pick?.(g.id);
            }}
            label={<div className="pl-2">{g.name}</div>}
            key={g.id}
          />
        ))}
    </Menu>
  );
};
