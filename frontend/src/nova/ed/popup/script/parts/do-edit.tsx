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
    const imports = lines.slice(1, region_end);
    const result = await fn({
      imports,
      body,
      wrapImports(imports) {
        return `\
// #region generated
${imports.join("\n")}
// #endregion
`;
      },
    });
    editor.executeEdits("paste-template", [
      {
        range: new monaco.Range(0, 0, Number.MAX_VALUE, Number.MAX_VALUE),
        text: result.join("\n"),
      },
    ]);

    const model = editor.getModel();
    if (model) {
      editor.restoreViewState(foldRegionVState(model.getLinesContent()));
    }
  };
};
