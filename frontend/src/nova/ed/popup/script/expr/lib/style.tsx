export const prasiExprStyle = css`
  .expr {
    display: flex;
    padding: 2px;
    flex-wrap: wrap;
    font-family: "Liga Menlo", monospace;

    .evalue {
    }
    .eopr {
      color: #8a1cff;
    }

    .evalue,
    .eopr {
      border-radius: 3px;
      padding: 2px 4px;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      cursor: pointer;

      &.eopr {
        padding: 2px;
      }

      &.hovered {
        background: #c0d0ff;
      }

      &.focused {
        outline: 1px solid blue;
        background: white;
      }

      > .content-editable {
        min-width: 10px;
        display: flex;
        align-items: center;
        outline: none;
        display: block;
        min-height: 1em;
      }
    }

    .evar {
      user-select: none;
      display: flex;
      align-items: center;
      border-radius: 2px;
      padding: 0px 4px;
      cursor: pointer;
      background: white;
      &:hover {
        background: #c0d0ff;
      }
    }

    .evalue {
      & .eicon {
        pointer-events: none;
        display: flex;
        align-items: center;
        padding-right: 5px;
        svg {
          width: 16px;
        }
      }
    }

    .value-content,
    .operator-content {
      font-size: 0.9em;

      &.value-content {
        font-size: 0.8em;
      }
      text-align: center;
    }
  }
`;
