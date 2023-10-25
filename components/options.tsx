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
    let numOfSelected = 0;
    tasks.map((task) => {
      if (task.selected) numOfSelected++;
    });
    if (numOfSelected === 0) renderMainPage(false, "details");
    return numOfSelected;
  };

  return (
    <>
      {optionsValue ? (
        <div className="grid grid-cols-5 m-auto w-6/12 gap-1 mt-5">
          <button className=" text-black bg-green-500 rounded-md">Swap</button>
          <button className=" text-black bg-green-500 rounded-md">
            Complete All
          </button>
          <button
            className={`text-black bg-green-500 rounded-md ${
              detailsValue ? "bg-red-500" : "bg-green-500"
            }`}
            onClick={() => {
              let numOfSelected = selectedCheck();
              if (numOfSelected) {
                renderMainPage(!detailsValue, "details");
              }
            }}
          >
            {detailsValue ? "Details..." : "Show Details"}
          </button>
          <button className=" text-black bg-red-500 rounded-md">Delete</button>
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
