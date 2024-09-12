import { PageTree } from "./page-tree";

export const EdPageHistory = ({ tree }: { tree: PageTree }) => {
  tree.watch();

  return (
    <div>
      Page History
      {Date.now()}
    </div>
  );
};
