import { useState } from "react";

export default function TaskButtons({
  taskObject,
  onRender,
}: {
  taskObject: {
    id: number;
    time: string | undefined;
    text: string;
    done: boolean;
    delete: boolean;
    showDetails: boolean;
  };
  onRender: (arg: number | boolean, fromComp: string) => void;
}) {
  let [doneValue, setDoneValue] = useState<boolean>(false);
  let [deleteValue, setDeleteValue] = useState<boolean>(taskObject.delete);
  return (
    <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:bg-green-600 before:top-[calc(50%-10px)] before:-left-[25px]">
      <div className=" text-black col-span-2">{taskObject.text}</div>
      {doneValue ? (
        <button
          className=" text-black col-span-1 bg-green-500 rounded-md "
          onClick={() => {
            taskObject.done = false;
            setDoneValue(false);
            onRender(taskObject.id / 2, "completed");
          }}
        >
          Done
        </button>
      ) : (
        <button
          className=" text-black col-span-1 bg-red-500 rounded-md "
          onClick={() => {
            taskObject.done = true;
            setDoneValue(true);
            onRender(taskObject.id, "completed");
          }}
        >
          Pending
        </button>
      )}
      <button
        className="text-black col-span-1 bg-red-500 rounded-md"
        onClick={() => {
          taskObject.delete = true;
          setDeleteValue(true);
          onRender(taskObject.id, "newTask");
        }}
      >
        Delete
      </button>
    </div>
  );
}
