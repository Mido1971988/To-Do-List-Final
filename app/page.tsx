"use client";

import NewTask from "@/components/newTask";
import Options from "@/components/options";
import { useState, useRef, useEffect } from "react";
import { TaskObject } from "@/types/TaskObject.types";

export default function Home() {
  let [updateDeleted, setUpdateDeleted] = useState(0);
  let [updateCompleted, setUpdateCompleted] = useState(0);
  let [optionsValue, setOptionsValue] = useState(false);
  let [updateDetails, setUpdateDetails] = useState(false);
  let [newTasksArray, setNewTasksArray] = useState<TaskObject[]>([]);
  let [completedArray, setcompletedArray] = useState<TaskObject[]>([]);
  let inputRef = useRef<HTMLInputElement>(null);
  let tasksArrayObjects = [...newTasksArray];

  // Delete task
  useEffect(() => {
    let filteredTasksArrayElements = tasksArrayObjects.filter((taskObject) => {
      if (taskObject.delete) {
        taskObject.done = false;
        setUpdateCompleted(taskObject.id / 3);
        return false;
      } else {
        return true;
      }
    });
    setNewTasksArray(filteredTasksArrayElements);
  }, [updateDeleted]);

  // Count no. of Completed Tasks
  useEffect(() => {
    let filteredCompletedTasksArray = tasksArrayObjects.filter((taskObject) => {
      if (taskObject.done) return true;
    });
    setcompletedArray(filteredCompletedTasksArray);
  }, [updateCompleted]);

  // to Show Details
  useEffect(() => {
    tasksArrayObjects.map((taskObject) => {
      if (taskObject.selected && updateDetails) {
        taskObject.showDetails = true;
      } else if (taskObject.selected && !updateDetails) {
        taskObject.showDetails = false;
      }
    });
    setNewTasksArray(tasksArrayObjects);
  }, [updateDetails]);

  // Re-render Page.tsx Component
  let renderMainPage = (arg: number | boolean, mission: string) => {
    if (mission === "deleteTask" && typeof arg === "number") {
      setUpdateDeleted(arg);
    } else if (mission === "completed" && typeof arg === "number") {
      setUpdateCompleted(arg);
    } else if (mission === "details" && typeof arg === "boolean") {
      setUpdateDetails(arg);
    } else if (mission === "options" && typeof arg === "boolean") {
      setOptionsValue(arg);
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
      edited: false,
      editedTime: "",
      selected: false,
      showDetails: false,
    };
    inputRef.current?.value ? (inputRef.current.value = "") : "";
    tasksArrayObjects.unshift(taskObject);
    setNewTasksArray(tasksArrayObjects);
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
      <Options
        optionsValue={optionsValue}
        renderMainPage={renderMainPage}
        tasks={tasksArrayObjects}
      />

      {/* All Tasks */}
      <div className=" flex flex-col items-center justify-center w-screen gap-1 mt-5">
        <div className=" w-6/12 bg-slate-100 p-7">
          <div className=" flex flex-col items-center justify-center gap-5 ">
            {tasksArrayObjects.length ? (
              tasksArrayObjects.map((taskObject) => (
                <NewTask
                  key={taskObject.id}
                  renderMainPage={renderMainPage}
                  taskObject={taskObject}
                  optionsValue={optionsValue}
                />
              ))
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
