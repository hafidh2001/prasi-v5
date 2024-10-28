import { MonacoEditor } from "utils/script/typings";
import { Monaco } from "../code/js/enable-jsx";
import { foldRegionVState } from "../code/js/fold-region-vstate";

export const defineScriptEdit = (editor: MonacoEditor, monaco: Monaco) => {
  return async (
    fn: (arg: {
      body: string;
      imports: string[];
      wrapImports: (imports: string[]) => string;
    }) => Promise<string[]>
  ) => {
    const source = (editor.getModel()?.getValue() || "").trim();

    const lines = source.split("\n");
    const region_end = lines.findIndex((line) =>
      line.startsWith("// #endregion")
    );
    const body = lines
      .slice(region_end + 1)
      .join("\n")
      .trim();
    const imports = lines.slice(1, region_end).filter((e) => e.trim());

    if (imports.length === 0) {
      imports.push(`import React from "react"`);
    }

    const arg = {
      imports,
      body,
      wrapImports(imports: string[]) {
        return `\
// #region generated
${imports.join("\n")}
// #endregion
`;
      },
    };
    let result = await fn(arg);
    const model = editor.getModel();
    if (model) {
      editor.executeEdits("prasi-update-code", [
        {
          range: new monaco.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE),
          text: result.join("\n"),
        },
      ]);
      editor.restoreViewState(foldRegionVState(model.getLinesContent()));
    }
  };
};
