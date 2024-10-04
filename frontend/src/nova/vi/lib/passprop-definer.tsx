import { memo } from "react";

export const passPropDefiner =
  (pass_props: Record<string, any>, id: string) => (pass: any) => {
    return {
      exports: {},
      PassProp: memo((props: any) => {
        return <>{props.children}</>;
      }),
    };
  };
