export default function NewTask(props: { inputValue: string | undefined }) {
  return (
    <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full">
      <div className=" text-black col-span-2">{props.inputValue}</div>
      <button className="text-black col-span-1 bg-green-500 rounded-md">
        Done
      </button>
      <button className="text-black col-span-1 bg-red-500 rounded-md">
        Edit
      </button>
    </div>
  );
}
