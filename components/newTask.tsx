import { useState } from "react";

export default function NewTask(props: {
  taskObject: { id: number; time: string; text: string; done: boolean };
}) {
  let [doneValue, setDoneValue] = useState<boolean>(props.taskObject.done);
  return (
    <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full">
      <div className=" text-black col-span-2">{props.taskObject.text}</div>
      {doneValue ? (
        <button
          className=" text-black col-span-1 bg-green-500 rounded-md "
          onClick={() => {
            props.taskObject.done = false;
            setDoneValue(false);
          }}
        >
          Done
        </button>
      ) : (
        <button
          className=" text-black col-span-1 bg-red-500 rounded-md "
          onClick={() => {
            props.taskObject.done = true;
            setDoneValue(true);
          }}
        >
          Pending
        </button>
      )}
      <button className="text-black col-span-1 bg-red-500 rounded-md">
        Delete
      </button>
    </div>
  );
}
