export const EdPropName = ({ name }: { name: string }) => {
  return (
    <div className="flex items-center pl-2 select-none flex-1 max-w-[100px] overflow-hidden">
      {name}
    </div>
  );
};
