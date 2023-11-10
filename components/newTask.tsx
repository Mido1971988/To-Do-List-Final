import { useState, useRef, useEffect } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function NewTask({
  taskObject,
  renderMainPage,
  optionsValue,
  detailsValue,
  moveValue,
}: {
  taskObject: TaskObject;
  renderMainPage: (arg: number | boolean, mission: string) => void;
  optionsValue: boolean;
  detailsValue: boolean;
  moveValue: boolean;
}) {
  let [selectValue, setSelectValue] = useState<boolean>(taskObject.selected);
  let taskTextRef = useRef<HTMLDivElement>(null);

  // to re-render if you clicked on Select All Button
  useEffect(() => {
    setSelectValue(taskObject.selected);
  }, [taskObject.selected]);

  let handleClick = (e: React.BaseSyntheticEvent) => {
    if (taskObject.selected && e.target.classList.contains("my-circle")) {
      taskObject.selected = false;
      setSelectValue(false);
    } else if (
      !taskObject.selected &&
      e.target.classList.contains("my-circle")
    ) {
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
    } else if (moveValue && e.target.classList.contains("up")) {
      taskObject.up = true;
      renderMainPage(Date.now(), "moveUp");
    } else if (moveValue && e.target.classList.contains("down")) {
      taskObject.down = true;
      renderMainPage(Date.now(), "moveDown");
    }
  };
  return (
    <>
      {taskObject.selected && detailsValue ? (
        <div
          className="grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative pointer-events-none"
          onClick={handleClick}
        >
          <div
            className={`my-circle ${
              optionsValue ? "absolute" : "hidden"
            } rounded-full border-black border-2 w-5 h-5 top-[calc(50%-10px)] -left-[25px] pointer-events-auto bg-green-600 `}
          ></div>
          <div className=" text-md font-bold font-sans col-span-4">
            ID : <span className=" font-medium">{taskObject.id}</span>
            <br />
            Created at : <span className=" font-medium">{taskObject.time}</span>
            <br />
            {taskObject.edited ? (
              <span className=" font-medium">
                <span className="font-bold font-sans">Edited at :</span>{" "}
                {taskObject.editedTime}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <div
          className="grid max-sm:grid-cols-5 grid-cols-5 gap-2 bg-white p-2 rounded-md w-full relative pointer-events-none"
          onClick={handleClick}
        >
          <div
            className={`up ${
              moveValue ? "absolute" : "hidden"
            } w-0 h-0 border-x-[12px] border-x-transparent border-b-[12px] border-b-green-500 top-0 -left-[24px] pointer-events-auto`}
          ></div>
          <div
            className={`down ${
              moveValue ? "absolute" : "hidden"
            } w-0 h-0 border-x-[12px] border-x-transparent border-t-[12px] border-t-green-500 bottom-0 -left-[24px] pointer-events-auto `}
          ></div>
          <div
            className={`my-circle ${
              optionsValue ? "absolute" : "hidden"
            } rounded-full border-black  border-2 w-5 h-5 top-[calc(50%-10px)] -left-[25px] pointer-events-auto ${
              selectValue || taskObject.selected
                ? "bg-green-600"
                : "border-black bg-white"
            }`}
          ></div>
          <div ref={taskTextRef} className=" text-black col-span-3 leading-7">
            {taskObject.text}
          </div>
          <button
            className={`${
              taskObject.done
                ? "text-white col-span-1 bg-green-500 rounded-md pointer-events-auto max-sm:text-[12px] h-7 self-center"
                : "text-white col-span-1 bg-slate-400 rounded-md pointer-events-auto max-sm:text-[12px] h-7 self-center"
            }`}
          >
            {taskObject.done ? "Done" : "Pending"}
          </button>
          <button
            className="text-white text-center leading-5 bg-red-500 h-5 w-5 rounded-full pointer-events-auto absolute top-[calc(50%-10px)] -right-[25px] font-sans font-bold"
            onClick={() => {
              taskObject.delete = true;
              renderMainPage(Date.now(), "deleteTask");
            }}
          >
            X
          </button>
          <button className=" text-white col-span-1 bg-red-500 rounded-md pointer-events-auto max-sm:text-[12px] h-7 self-center">
            Edit
          </button>
        </div>
      )}
    </>
  );
}
