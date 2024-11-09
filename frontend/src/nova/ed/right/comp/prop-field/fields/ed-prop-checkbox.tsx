import { active, getActiveTree } from "logic/active";
import { EDGlobal } from "logic/ed-global";
import { extractRegion } from "popup/script/code/js/migrate-code";
import { codeUpdate } from "popup/script/code/prasi-code-update";
import { useEffect } from "react";
import { useGlobal } from "utils/react/use-global";
import { useLocal } from "utils/react/use-local";
import { IItem } from "utils/types/item";
import { FNCompDef } from "utils/types/meta-fn";
import { Dropdown } from "utils/ui/dropdown";
import { extractString } from "./ed-prop-string";
import trim from "lodash.trim";

export const EdPropOption = ({
  name,
  field,
  instance,
}: {
  name: string;
  field: FNCompDef;
  instance: Exclude<IItem["component"], undefined>;
}) => {
  
};
