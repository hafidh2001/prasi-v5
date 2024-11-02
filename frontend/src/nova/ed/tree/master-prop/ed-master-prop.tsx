import { active } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { Plus } from "lucide-react";
import { useGlobal } from "utils/react/use-global";

export const EdMasterProp = () => {
  const p = useGlobal(EDGlobal, "EDITOR");
  const item = active.comp?.snapshot;
  const comp = item?.component;
  if (!comp) return null;

  return (
    <div className="flex flex-col items-stretch flex-1 w-full h-full text-sm">
      <div className="flex-1 relative overflow-auto">
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center space-x-1 border border-blue-500 cursor-pointer m-1 px-[5px] text-blue-500 hover:bg-blue-600 hover:text-white self-start rounded-sm">
            <Plus size={12} /> <div>Add New Prop</div>
          </div>
        </div>
      </div>
    </div>
  );
};
