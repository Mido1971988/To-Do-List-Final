import { useState } from "react";

export default function NewTask({
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
  let [selectValue, setSelectValue] = useState<boolean>(false);
  let [deleteValue, setDeleteValue] = useState<boolean>(taskObject.delete);

  let handleClick = (e: React.BaseSyntheticEvent) => {
    if (selectValue && e.target.children.length) {
      setSelectValue(false);
    } else if (!selectValue && e.target.children.length) {
      setSelectValue(true);
    } else if (e.target.innerHTML === "Pending") {
      e.target.innerHTML = "Done";
      taskObject.done = true;
      setDoneValue(true);
      onRender(taskObject.id, "completed");
    } else if (e.target.innerHTML === "Done") {
      e.target.innerHTML = "Pending";
      taskObject.done = false;
      setDoneValue(false);
      onRender(taskObject.id / 2, "completed");
    } else if (e.target.innerHTML === "Edit") {
    }
  };
  return (
    <>
      {taskObject.showDetails ? (
        <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:bg-green-600 before:top-[calc(50%-10px)] before:-left-[25px]">
          <div className=" text-md font-bold font-sans col-span-4">
            ID : <span className=" font-medium">{taskObject.id}</span>
            <br />
            Created at : <span className=" font-medium">{taskObject.time}</span>
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative pointer-events-none before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:border-2  before:top-[calc(50%-10px)] before:-left-[25px] before:pointer-events-auto  ${
            selectValue
              ? "before:bg-green-600"
              : "before:border-black before:bg-white"
          }`}
          onClick={handleClick}
        >
          <div className=" text-black col-span-2">{taskObject.text}</div>
          <button
            className={`${
              doneValue
                ? "text-white col-span-1 bg-green-500 rounded-md pointer-events-auto"
                : "text-white col-span-1 bg-slate-400 rounded-md pointer-events-auto"
            }`}
          >
            Pending
          </button>
          <button
            className="text-white text-center leading-5 bg-red-500 h-5 w-5 rounded-full pointer-events-auto absolute top-[calc(50%-10px)] -right-[25px]"
            onClick={() => {
              taskObject.delete = true;
              setDeleteValue(true);
              onRender(taskObject.id, "newTask");
            }}
          >
            X
          </button>
          <button className=" text-white col-span-1 bg-red-500 rounded-md pointer-events-auto">
            Edit
          </button>
        </div>
      )}
    </>
  );
}
