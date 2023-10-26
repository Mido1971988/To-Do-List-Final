import { useState } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function Options({
  optionsValue,
  renderMainPage,
  tasks,
  detailsValue,
}: {
  optionsValue: boolean;
  renderMainPage: (arg: number | boolean, fromComp: string) => void;
  tasks: TaskObject[];
  detailsValue: boolean;
}) {
  // to Check no. of selected tasks
  let selectedCheck = () => {
    let selectedTasks = tasks.filter((task) => {
      if (task.selected) return true;
    });
    if (selectedTasks.length === 0) renderMainPage(false, "details");
    return selectedTasks;
  };

  let [completeButton, setCompleteButton] = useState(true);

  return (
    <>
      {optionsValue ? (
        <div className="grid grid-cols-5 m-auto w-6/12 gap-1 mt-5">
          <button className=" text-black bg-green-500 rounded-md">Swap</button>
          <button
            className={`text-black rounded-md ${
              completeButton ? "bg-green-500" : "bg-red-500"
            }`}
            onClick={() => {
              let selectedTasks = selectedCheck();
              if (selectedTasks.length) {
                selectedTasks.map((selectedTask) => {
                  if (completeButton) {
                    selectedTask.done = true;
                  } else {
                    selectedTask.done = false;
                  }
                });
                setCompleteButton(!completeButton);
                renderMainPage(Date.now(), "completed");
              }
            }}
          >
            {completeButton ? "Complete" : "unComplete"}
          </button>
          <button
            className={`text-black bg-green-500 rounded-md ${
              detailsValue ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={() => {
              let selectedTasks = selectedCheck();
              if (selectedTasks.length) {
                renderMainPage(!detailsValue, "details");
              }
            }}
          >
            {detailsValue ? "Details..." : "Show Details"}
          </button>
          <button
            className=" text-black bg-red-500 rounded-md"
            onClick={() => {
              let selectedTasks = selectedCheck();
              selectedTasks.map((selectedTask) => (selectedTask.delete = true));
              renderMainPage(Date.now(), "deleteTask");
            }}
          >
            Delete
          </button>
          <button
            className=" text-black bg-green-500 rounded-md"
            onClick={() => renderMainPage(false, "options")}
          >
            Selecting
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 m-auto w-6/12 gap-60 mt-5">
          <button className=" text-white justify-items-start  bg-green-500 rounded-md">
            Move
          </button>
          <button
            className=" text-white justify-items-end bg-green-500 rounded-md"
            onClick={() => renderMainPage(true, "options")}
          >
            Select
          </button>
        </div>
      )}
    </>
  );
}
