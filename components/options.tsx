import { useState } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function Options({
  optionsValue,
  renderMainPage,
  tasks,
}: {
  optionsValue: boolean;
  renderMainPage: (arg: number | boolean, fromComp: string) => void;
  tasks: TaskObject[];
}) {
  let [detailsValue, setDetailsValue] = useState(true);

  let selectedCheck = () => {
    let numOfSelected = 0;
    tasks.map((task) => {
      if (task.selected) numOfSelected++;
    });
    return numOfSelected;
  };
  return (
    <>
      {optionsValue ? (
        <div className="grid grid-cols-5 m-auto w-6/12 gap-1 mt-5">
          <button className=" text-black bg-green-500 rounded-md">Swap</button>
          <button className=" text-black bg-green-500 rounded-md">
            Select All
          </button>
          <button
            className=" text-black bg-green-500 rounded-md"
            onClick={() => {
              let numOfSelected = selectedCheck();
              if (numOfSelected) {
                renderMainPage(detailsValue, "details");
                setDetailsValue(!detailsValue);
              }
            }}
          >
            Details
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
