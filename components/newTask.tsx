import { useState, useRef, useEffect } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function NewTask({
  taskObject,
  renderMainPage,
  optionsValue,
  detailsValue,
}: {
  taskObject: TaskObject;
  renderMainPage: (arg: number | boolean, mission: string) => void;
  optionsValue: boolean;
  detailsValue: boolean;
}) {
  let [selectValue, setSelectValue] = useState<boolean>(taskObject.selected);
  let [deleteValue, setDeleteValue] = useState<boolean>(taskObject.delete);
  let taskTextRef = useRef<HTMLDivElement>(null);

  // to re-render if you clicked on Select All Button
  useEffect(() => {
    setSelectValue(taskObject.selected);
  }, [taskObject.selected]);

  let handleClick = (e: React.BaseSyntheticEvent) => {
    if (taskObject.selected && e.target.children.length) {
      taskObject.selected = false;
      setSelectValue(false);
    } else if (!taskObject.selected && e.target.children.length) {
      taskObject.selected = true;
      setSelectValue(true);
    } else if (e.target.innerHTML === "Pending") {
      taskObject.done = true;
      renderMainPage(Date.now(), "completed");
    } else if (e.target.innerHTML === "Done") {
      taskObject.done = false;
      renderMainPage(Date.now(), "completed");
    } else if (e.target.innerHTML === "Edit") {
      let newText = prompt("Editing The Task...");
      if (newText) {
        if (taskTextRef.current?.innerHTML) {
          taskTextRef.current.innerHTML = newText;
          taskObject.text = newText;
          taskObject.edited = true;
          taskObject.editedTime = new Date()
            ?.toString()
            ?.match(/\w+ \d+ \d+ \d+:\d+:\d+/gi)
            ?.join("");
        }
      }
    }
  };
  return (
    <>
      {taskObject.selected && detailsValue ? (
        <div
          className={`grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:bg-green-600 before:top-[calc(50%-10px)] before:-left-[25px] before:pointer-events-auto ${
            optionsValue ? "before:absolute" : "before:hidden"
          }`}
          onClick={handleClick}
        >
          <div className=" text-md font-bold font-sans col-span-4">
            ID : <span className=" font-medium">{taskObject.id}</span>
            <br />
            Created at : <span className=" font-medium">{taskObject.time}</span>
            <br />
            {taskObject.edited ? (
              <span className=" font-medium">
                Edited at : {taskObject.editedTime}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div
          className={`grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative pointer-events-none before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:border-2  before:top-[calc(50%-10px)] before:-left-[25px] before:pointer-events-auto  ${
            selectValue || taskObject.selected
              ? "before:bg-green-600"
              : "before:border-black before:bg-white"
          } ${optionsValue ? "before:absolute" : "before:hidden"}`}
          onClick={handleClick}
        >
          <div ref={taskTextRef} className=" text-black col-span-2">
            {taskObject.text}
          </div>
          <button
            className={`${
              taskObject.done
                ? "text-white col-span-1 bg-green-500 rounded-md pointer-events-auto"
                : "text-white col-span-1 bg-slate-400 rounded-md pointer-events-auto"
            }`}
          >
            {taskObject.done ? "Done" : "Pending"}
          </button>
          <button
            className="text-white text-center leading-5 bg-red-500 h-5 w-5 rounded-full pointer-events-auto absolute top-[calc(50%-10px)] -right-[25px] font-sans font-bold"
            onClick={() => {
              taskObject.delete = true;
              setDeleteValue(true);
              renderMainPage(Date.now(), "deleteTask");
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
