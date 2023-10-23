import { useState } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function Options({
  onRender,
  tasks,
}: {
  onRender: (arg: number | boolean, fromComp: string) => void;
  tasks: TaskObject[];
}) {
  let [optionsValue, setOptionsValue] = useState(false);
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
                onRender(detailsValue, "details");
                setDetailsValue(!detailsValue);
              }
            }}
          >
            Details
          </button>
          <button className=" text-black bg-red-500 rounded-md">Delete</button>
          <button
            className=" text-black bg-green-500 rounded-md"
            onClick={() => setOptionsValue(false)}
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
            onClick={() => setOptionsValue(true)}
          >
            Select
          </button>
        </div>
      )}
    </>
  );
}
