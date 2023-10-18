"use client";

import NewTask from "@/components/newTask";
import OptionsOne from "@/components/optionsOne";
import OptionsTwo from "@/components/optionsTwo";
import { useState, useRef } from "react";

export default function Home() {
  let [optionsValue, setOptionsValue] = useState(true);
  let [newTasksArray, setNewTasksArray] = useState<Array<string>>([]);
  let inputRef = useRef<HTMLInputElement>(null);

  let tasks: Array<string> = [...newTasksArray];
  let tasksArrayElements = [];
  for (let i = 0; i < tasks.length; i++) {
    let taskDate = new Date(Date.now()).toString();
    let taskObject = {
      id: i,
      time: taskDate,
      text: newTasksArray[i],
      done: false,
    };
    tasksArrayElements.push(<NewTask key={i} taskObject={taskObject} />);
  }

  return (
    <>
      {/* To Do List Title */}
      <h1 className=" text-red-600 text-[40px] font-black font-serif text-center mt-5">
        To Do List
      </h1>

      {/* no. of Tasks and no. of Completed */}
      <div className="grid grid-cols-2 w-6/12 m-auto mt-5">
        <div className=" flex gap-3 justify-center">
          <div className=" text-black">no. of Tasks</div>
          <div className=" text-black bg-red-500 rounded-full flex justify-center items-center w-6 h-6">
            0
          </div>
        </div>
        <div className=" flex gap-3 justify-center">
          <div className=" text-black">no. of Completed</div>
          <div className=" text-black bg-green-500 rounded-full flex justify-center items-center w-6 h-6">
            0
          </div>
        </div>
      </div>

      {/* Select All & Delete All */}
      <div className="grid grid-cols-2 w-6/12 m-auto mt-5 gap-20 pl-5 pr-5">
        <button className="text-black col-span-1 bg-green-500 rounded-md">
          Select All
        </button>
        <button className="text-black col-span-1 bg-red-500 rounded-md">
          Delete All
        </button>
      </div>

      {/* Write your Task */}
      <div className=" grid grid-cols-3 gap-4 w-6/12 m-auto mt-5 p-5 bg-slate-100 rounded-md">
        <input
          type="text"
          placeholder="Write your Task!"
          className=" text-black outline-none col-span-2 rounded-md"
          ref={inputRef}
        ></input>
        <button
          className="text-black col-span-1 bg-green-500 rounded-md"
          onClick={() => {
            tasks.push(
              inputRef.current?.value ? inputRef.current?.value : "no Input"
            );
            if (inputRef.current?.value) inputRef.current.value = "";
            setNewTasksArray(tasks);
          }}
        >
          Add Task
        </button>
      </div>

      {/* Options */}
      {optionsValue ? <OptionsOne setFunc={setOptionsValue} /> : <OptionsTwo />}

      {/* All Tasks */}
      <div className=" flex flex-col items-center justify-center w-screen gap-1 mt-5">
        <div className=" w-6/12 bg-slate-100 p-5">
          <div className=" flex flex-col items-center justify-center gap-5 ">
            {newTasksArray.length ? (
              tasksArrayElements.reverse()
            ) : (
              <div className=" text-slate-400 bg-white w-full text-center font-bold">
                NO TASKS
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
