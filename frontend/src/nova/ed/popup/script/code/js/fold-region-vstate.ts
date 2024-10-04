export const foldRegionVState = (str: string[], vstate?: any) => {
  let start = -1;
  let end = -1;
  for (let i = 0; i < str.length; i++) {
    if (start < 0 && str[i].startsWith("// #region")) {
      start = i;
      continue;
    }
    if (start >= 0 && end < 0 && str[i].startsWith("// #endregion")) {
      end = i;
      break;
    }
  }
  return {
    cursorState: [
      {
        inSelectionMode: false,
        selectionStart: {
          lineNumber: 1,
          column: 1,
        },
        position: {
          lineNumber: 1,
          column: 1,
        },
      },
    ],
    viewState: {
      scrollLeft: 0,
      firstPosition: {
        lineNumber: 1,
        column: 1,
      },
      firstPositionDeltaTop: 0,
    },
    ...vstate,
    contributionsState: {
      "editor.contrib.wordHighlighter": false,
      "editor.contrib.folding": {
        collapsedRegions: [
          {
            startLineNumber: start + 1,
            endLineNumber: end + 1,
            isCollapsed: true,
            source: 0,
          },
        ],
        provider: "indent",
        foldedImports: false,
      },
    },
  };
};
