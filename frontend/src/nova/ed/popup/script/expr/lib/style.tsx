export const prasiExprStyle = css`
  .expr {
    display: flex;
    padding: 2px;
    flex-wrap: wrap;

    .evalue {
      border: 1px solid #ccc;
    }
    .eopr {
      border: 1px solid #8a1cff;
    }

    .evalue,
    .eopr {
      border-radius: 3px;
      padding: 2px 4px;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      cursor: pointer;

      &.blank {
        border: 1px solid white;
      }

      &.hovered {
        background: #c0d0ff;
        border: 1px solid #c0d0ff;
      }

      &.focused {
        outline: 1px solid blue;
        border: 1px solid blue;
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
      margin-right: -2px;
      cursor: pointer;
      background: white;
      &:hover {
        background: #c0d0ff;
      }
    }

    .evalue {
      margin-right: 5px;

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
    }
  }
`;
