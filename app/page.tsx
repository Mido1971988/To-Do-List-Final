"use client";

import NewTask from "@/components/newTask";
import OptionsOne from "@/components/optionsOne";
import OptionsTwo from "@/components/optionsTwo";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  let [optionsValue, setOptionsValue] = useState(true);
  let [showDetails, setShowDetails] = useState(false);
  let [updateDeleted, setUpdateDeleted] = useState(0);
  let [updateCompleted, setUpdateCompleted] = useState(0);
  let [newTasksArray, setNewTasksArray] = useState<JSX.Element[]>([]);
  let [completedArray, setcompletedArray] = useState<JSX.Element[]>([]);
  let inputRef = useRef<HTMLInputElement>(null);
  let tasksArrayElements: JSX.Element[] = [...newTasksArray];

  // Delete task
  useEffect(() => {
    let filteredTasksArrayElements = tasksArrayElements.filter((element) => {
      if (element.props.taskObject.delete) {
        element.props.taskObject.done = false;
        setUpdateCompleted(element.props.taskObject.id / 3);
        return false;
      } else {
        return true;
      }
    });
    setNewTasksArray(filteredTasksArrayElements);
  }, [updateDeleted]);

  // Count no. of Completed Tasks
  useEffect(() => {
    let filteredCompletedTasksArray = tasksArrayElements.filter((element) => {
      if (element.props.taskObject.done) return true;
    });
    setcompletedArray(filteredCompletedTasksArray);
  }, [updateCompleted]);

  // Re-render Page.tsx Component
  let onRender = (arg: number | boolean, fromComp: string) => {
    if (fromComp === "options-select" && typeof arg === "boolean") {
      setOptionsValue(arg);
    } else if (fromComp === "newTask" && typeof arg === "number") {
      setUpdateDeleted(arg);
    } else if (fromComp === "completed" && typeof arg === "number") {
      setUpdateCompleted(arg);
    } else if (fromComp === "options-details" && typeof arg === "boolean") {
      setShowDetails(arg);
    }
  };
  // Input function
  let insertInput = () => {
    if (inputRef.current?.value === "") {
      inputRef.current.placeholder = "You can't add Empty Task";
      return;
    }
    inputRef.current?.placeholder
      ? (inputRef.current.placeholder = "Write your Task!")
      : "";
    let taskObject = {
      id: Date.now(),
      time: new Date()
        ?.toString()
        ?.match(/\w+ \d+ \d+ \d+:\d+:\d+/gi)
        ?.join(""),
      text: inputRef.current?.value ? inputRef.current?.value : "no Input",
      done: false,
      delete: false,
      showDetails: showDetails,
    };
    inputRef.current?.value ? (inputRef.current.value = "") : "";
    tasksArrayElements.push(
      <NewTask
        key={taskObject.id}
        taskObject={taskObject}
        onRender={onRender}
      />
    );
    setNewTasksArray(tasksArrayElements);
  };

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
            {newTasksArray.length}
          </div>
        </div>
        <div className=" flex gap-3 justify-center">
          <div className=" text-black">no. of Completed</div>
          <div className=" text-black bg-green-500 rounded-full flex justify-center items-center w-6 h-6">
            {completedArray.length}
          </div>
        </div>
      </div>

      {/* Select All & Delete All */}
      <div className="grid grid-cols-2 w-6/12 m-auto mt-5 gap-20 pl-5 pr-5">
        <button className="text-white col-span-1 bg-green-500 rounded-md">
          Select All
        </button>
        <button
          className="text-white col-span-1 bg-red-500 rounded-md"
          onClick={() => {
            if (confirm("Are You Sure Delete All Tasks ?")) {
              setcompletedArray([]);
              setNewTasksArray([]);
            } else {
              return;
            }
          }}
        >
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
          className="text-white col-span-1 bg-green-500 rounded-md"
          onClick={insertInput}
        >
          Add Task
        </button>
      </div>

      {/* Options */}
      {optionsValue ? (
        <OptionsOne onRender={onRender} />
      ) : (
        <OptionsTwo onRender={onRender} />
      )}

      {/* All Tasks */}
      <div className=" flex flex-col items-center justify-center w-screen gap-1 mt-5">
        <div className=" w-6/12 bg-slate-100 p-7">
          <div className=" flex flex-col items-center justify-center gap-5 ">
            {newTasksArray.length ? (
              [...tasksArrayElements].reverse()
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
