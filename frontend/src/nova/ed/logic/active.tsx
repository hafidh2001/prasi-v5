export const active = {
  item_id: "",
  comp_id: "",
  hover: { id: "", tree: false },
  instance: {
    get comp_id() {
      if (target.instance_comp_id === false) {
        target.instance_comp_id =
          localStorage.getItem("prasi-instance-comp-id") || "";
      }
      return target.instance_comp_id || "";
    },
    set comp_id(val: string) {
      localStorage.setItem("prasi-instance-comp-id", val || "");
      target.instance_comp_id = val || "";
    },
    get item_id() {
      if (target.instance_item_id === false) {
        target.instance_item_id =
          localStorage.getItem("prasi-instance-item-id") || "";
      }
      return target.instance_item_id || "";
    },
    set item_id(val: string) {
      localStorage.setItem("prasi-instance-item-id", val || "");
      target.instance_item_id = val || "";
    },
  },
};

const target = {
  active_id: false as any,
  comp_id: false as any,
  instance_comp_id: false as any,
  instance_item_id: false as any,
};
