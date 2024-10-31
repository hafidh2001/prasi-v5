import { ScrollText, Search } from "lucide-react";

export const EdCodeFindAllBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex items-center space-x-1 pl-1">
      <div className="top-btn" onClick={onClick}>
        <Search size={12} className="mr-1" />
        Find All
      </div>
    </div>
  );
};
