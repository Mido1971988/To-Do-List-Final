export default function OptionsTwo({
  selectOptions,
}: {
  selectOptions: (arg: number | boolean, fromComp: string) => void;
}) {
  return (
    <div className="grid grid-cols-5 m-auto w-6/12 gap-1 mt-5">
      <button className=" text-black bg-green-500 rounded-md">Swap</button>
      <button className=" text-black bg-green-500 rounded-md">
        Select All
      </button>
      <button className=" text-black bg-green-500 rounded-md">Details</button>
      <button className=" text-black bg-red-500 rounded-md">Delete</button>
      <button
        className=" text-black bg-green-500 rounded-md"
        onClick={() => selectOptions(true, "options")}
      >
        Selecting
      </button>
    </div>
  );
}
