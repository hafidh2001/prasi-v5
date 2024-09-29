import { PrasiExpr } from "popup/script/expr/prasi-expr";
import { page } from "../../utils/react/page";

export default page({
  url: "/coba",
  component: ({}) => {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className=" w-[300px] h-[600px] border p-2 flex items-center">
          <PrasiExpr
            // value={{
            //   type: "expression",
            //   base: { value: "VARNAME", type: "string" },
            // }}
            value={{
              type: "expression",
              base: {
                type: "variable",
                name: "VARNAME",
                typings: "string",
                resolve() {
                  return { type: "string", value: "asda" };
                },
              },
            }}
          />
        </div>
      </div>
    );
  },
});
