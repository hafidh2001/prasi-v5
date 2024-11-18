import { component_group } from "prasi-db";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { Menu, MenuItem } from "../../../../utils/ui/context-menu";
import { Loading } from "../../../../utils/ui/loading";
import { EDGlobal } from "../../logic/ed-global";

export const EdPopCompGroup = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const popup = p.ui.popup.comp.data;
  const local = useLocal({ picked_group_id: "" }, async () => {
    if (popup.groups.length == 0) {
      popup.groups = await _db.component_group.findMany({
        where: {
          component_site: { some: { id_site: p.site.id } },
        },
        select: { id: true, name: true },
      });
    }
    if (popup.groups.length === 0) {
      const first = await _db.component_group.create({
        data: {
          name: "Site Components",
          component_site: { create: { id_site: p.site.id } },
        },
        select: { id: true, name: true },
      });

      const trash = await _db.component_group.create({
        data: {
          name: "__TRASH__",
          component_site: { create: { id_site: p.site.id } },
        },
        select: { id: true, name: true },
      });
      popup.groups.push(first);
      popup.groups.push(trash);
    }

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
        if (pop.on_close) pop.on_close(local.picked_group_id);
      }}
    >
      <MenuItem
        disabled
        label={
          popup.groups.length === 0 ? (
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
      {popup.groups
        .filter((g) => g.name !== "__TRASH__")
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .map((g) => (
          <MenuItem
            onClick={() => {
              local.picked_group_id = g.id;
              p.ui.popup.comp_group?.on_pick?.(g.id);
            }}
            label={<div className="pl-2">{g.name}</div>}
            key={g.id}
          />
        ))}
    </Menu>
  );
};
