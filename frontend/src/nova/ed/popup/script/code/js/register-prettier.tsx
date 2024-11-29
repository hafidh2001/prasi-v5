import { jscript } from "utils/script/jscript";
import { Monaco } from "./enable-jsx";
import trim from "lodash.trim";
import { waitUntil } from "prasi-utils";

export const registerPrettier = (monaco: Monaco) => {
  const m = monaco as any;
  if (m.prasiPrettierRegistered) return;
  m.prasiPrettierRegistered = true;
  
  monaco.languages.registerDocumentFormattingEditProvider("typescript", {
    async provideDocumentFormattingEdits(model, options, token) {
      if (!jscript.loaded) {
        await waitUntil(() => jscript.loaded);
      }

      const text = trim(
        await jscript.prettier.format(model.getValue()),
        "; \n"
      );

      return [
        {
          range: model.getFullModelRange(),
          text,
        },
      ];
    },
  });

  monaco.languages.registerCompletionItemProvider("typescript", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      return {
        suggestions: [
          {
            label: "log",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Add Console.log",
            insertText: `console.log($1)`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          },
          {
            label: "stringify",
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: "Add JSON.stringify",
            insertText: `JSON.stringify($1)`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          },
        ],
      };
    },
  });

  monaco.languages.registerCompletionItemProvider("typescript", {
    triggerCharacters: [">"],
    provideCompletionItems: (model, position) => {
      const codePre: string = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const tag = codePre.match(/.*<(\w+)>$/)?.[1];

      if (!tag) {
        return;
      }

      const word = model.getWordUntilPosition(position);

      return {
        suggestions: [
          {
            label: `</${tag}>`,
            kind: monaco.languages.CompletionItemKind.EnumMember,
            insertText: `$1</${tag}>`,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          },
        ],
      };
    },
  });
};
