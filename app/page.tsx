"use client";

import NewTask from "@/components/newTask";
import Options from "@/components/options";
import SigninButton from "@/components/signinButton";
import { useState, useRef, useEffect } from "react";
import { TaskObject } from "@/types/TaskObject.types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  // Hook for tasks
  let [newTasksArray, setNewTasksArray] = useState<TaskObject[]>([]);

  // Hooks for options.tsx
  let [optionsValue, setOptionsValue] = useState(false);
  let [moveValue, setMoveValue] = useState(false);
  let [detailsValue, setDetailsValue] = useState(false);

  // Hook of Select All Button
  let [selectAllValue, setSelectAllValue] = useState(true);

  // Hook to Delete Tasks
  let [updateDeleted, setUpdateDeleted] = useState(0);

  // Hook for no. of Completed
  let [completedArray, setcompletedArray] = useState<TaskObject[]>([]);

  // Hook for Loading from server
  let [loading, setLoading] = useState(0);

  // Hook for useSession to get status of signed User
  let { data: session, status } = useSession();

  // refs
  let inputRef = useRef<HTMLInputElement>(null);
  let selectAllRef = useRef<HTMLButtonElement>(null);
  let skipInitialRender = useRef(false);

  // Array of Tasks's Objects
  let tasksArrayObjects: TaskObject[] = [...newTasksArray];

  // Fetch tasks according to signed user by next-auth
  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      toast
        // .promise(fetch("http://localhost:3500/tasks"), {
        .promise(fetch("/api/tasks"), {
          pending: "Signing in....",
          success: {
            render() {
              return `${session?.user?.name} Signed In`;
            },
            icon: "🟢",
          },
          error: "Signing in Failed!",
        })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to Fetch");
          }
          return res.json();
        })
        .then((res) => {
          if (session && session.user && session.user.name) {
            let username = session?.user?.name;
            let foundTasks = res.filter(
              (task: { [key: string]: TaskObject[] }) => {
                if (task[username]) return true;
              }
            );
            if (foundTasks.length) {
              setNewTasksArray(foundTasks[0][username]);
              let filteredCompletedTasksArray = noOfCompleted(
                foundTasks[0][username]
              );
              setcompletedArray(filteredCompletedTasksArray);
            }
          }
        })
        .catch((err) => toast.error("Failed to Fecth Tasks from Server"));
    }
  }, [status]);

  // to Load Tasks when Load Button Clicked
  useEffect(() => {
    if (skipInitialRender.current) {
      if (session?.user) {
        toast
          // .promise(fetch("http://localhost:3500/tasks"), {
          .promise(fetch("/api/tasks"), {
            pending: "Signing in....",
            success: `${session?.user?.name}'s Task Loaded`,
            error: "Signing in Failed!",
          })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to Fetch");
            }
            return res.json();
          })
          .then((res) => {
            if (session && session.user && session.user.name) {
              let username = session?.user?.name;
              let foundTasks = res.filter(
                (task: { [key: string]: TaskObject[] }) => {
                  if (task[username]) return true;
                }
              );
              if (foundTasks.length) {
                setNewTasksArray(foundTasks[0][username]);
                let filteredCompletedTasksArray = noOfCompleted(
                  foundTasks[0][username]
                );
                setcompletedArray(filteredCompletedTasksArray);
              }
            }
          })
          .catch((err) => toast.error("Failed to Fecth Tasks from Server"));
      } else {
        toast.error("No User Signed In! ⛔️ ");
      }
    }
    skipInitialRender.current = true;
  }, [loading]);

  // Delete task
  useEffect(() => {
    let filteredTasksArrayElements = tasksArrayObjects.filter((taskObject) => {
      if (taskObject.delete) {
        taskObject.done = false;
        let filteredCompletedTasksArray = noOfCompleted(newTasksArray);
        setcompletedArray(filteredCompletedTasksArray);
        return false;
      } else {
        return true;
      }
    });
    setNewTasksArray(filteredTasksArrayElements);
  }, [updateDeleted]);

  // check no. of completed tasks
  let noOfCompleted = (tasks: TaskObject[]) => {
    let filteredCompletedTasksArray = tasks.filter((taskObject) => {
      if (taskObject.done) return true;
    });
    return filteredCompletedTasksArray;
  };

  // Re-render Page.tsx Component
  let renderMainPage = (arg: number | boolean, mission: string) => {
    if (mission === "deleteTask" && typeof arg === "number") {
      setUpdateDeleted(arg);
    } else if (mission === "completed" && typeof arg === "number") {
      let filteredCompletedTasksArray = noOfCompleted(newTasksArray);
      setcompletedArray(filteredCompletedTasksArray);
    } else if (mission === "details" && typeof arg === "boolean") {
      setDetailsValue(arg);
    } else if (mission === "options" && typeof arg === "boolean") {
      if (!arg && selectAllRef.current?.innerHTML === "Deselect All") {
        selectAllRef.current.innerHTML = "Select All";
        setSelectAllValue(true);
        tasksArrayObjects.map((taskObject) => (taskObject.selected = false));
      }
      if (!tasksArrayObjects.length) {
        setOptionsValue(false);
        toast.error("No Tasks To Select !");
      } else {
        setOptionsValue(arg);
      }
    } else if (mission === "move" && typeof arg === "boolean") {
      if (!tasksArrayObjects.length) {
        setMoveValue(false);
        toast.error("No Tasks To Move !");
      } else {
        setMoveValue(arg);
      }
    } else if (mission === "moveUp" && typeof arg === "number") {
      tasksArrayObjects.map((task, indx) => {
        if (indx === 0) task.up = false;
        if (task.up) {
          [tasksArrayObjects[indx], tasksArrayObjects[indx - 1]] = [
            tasksArrayObjects[indx - 1],
            tasksArrayObjects[indx],
          ];
          task.up = false;
        }
        setNewTasksArray([...tasksArrayObjects]);
      });
    } else if (mission === "moveDown" && typeof arg === "number") {
      tasksArrayObjects.map((task, indx) => {
        if (indx === tasksArrayObjects.length - 1) task.down = false;
        if (task.down) {
          [tasksArrayObjects[indx], tasksArrayObjects[indx + 1]] = [
            tasksArrayObjects[indx + 1],
            tasksArrayObjects[indx],
          ];
          task.down = false;
        }
        setNewTasksArray([...tasksArrayObjects]);
      });
    } else if (mission === "loading" && typeof arg === "number") {
      setLoading(arg);
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
      up: false,
      down: false,
    };
    inputRef.current?.value ? (inputRef.current.value = "") : "";
    tasksArrayObjects.unshift(taskObject);
    setNewTasksArray(tasksArrayObjects);
  };

  // Select All on click Function
  let selectAllFunc = (e: React.MouseEvent | null = null) => {
    if (!tasksArrayObjects.length) {
      toast.error("No Tasks to Select !");
      return;
    }
    if (e?.currentTarget.innerHTML === "Select All") {
      e.currentTarget.innerHTML = "Deselect All";
      tasksArrayObjects.map((taskObject) => (taskObject.selected = true));
      setSelectAllValue(!selectAllValue);
      if (!optionsValue) setOptionsValue(true);
    } else if (e?.currentTarget.innerHTML === "Deselect All") {
      e.currentTarget.innerHTML = "Select All";
      tasksArrayObjects.map((taskObject) => {
        taskObject.selected = false;
      });
      setDetailsValue(false);
      setSelectAllValue(!selectAllValue);
    }
  };

  // to check if Server Online or Not
  let handleServer = (e: React.MouseEvent) => {
    (async (ele) => {
      try {
        // const response = await fetch("http://localhost:3500/listOfUsers");
        const response = await fetch("api/listOfUsers");
        if (response.ok) {
          ele.innerHTML = `Server is 🟢`;
        }
      } catch (error) {
        ele.innerHTML = `Server is 🔴`;
      }
    })(e.currentTarget);
  };

  return (
    <>
      {/* Check Server Button */}
      <button
        className=" text-black font-serif font-bold col-span-1 rounded-md w-30 mt-5"
        onClick={(e) => handleServer(e)}
      >
        Check Server
      </button>
      {/* To Do List Title */}
      <h1 className=" text-red-600 text-[40px] font-black font-serif text-center mt-5">
        To Do List
      </h1>

      {/* Sign In and Sign Up Buttons */}
      {/* <SigninButton></SigninButton> */}
      <div className="flex justify-center gap-5">
        <SigninButton></SigninButton>
        {session && session.user ? (
          ""
        ) : (
          <Link
            href={"/signUp"}
            className="text-red-600 text-6 font-black font-serif text-center mt-5"
            scroll={false}
          >
            Sign Up
          </Link>
        )}
      </div>

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
        <button
          ref={selectAllRef}
          className={`text-white col-span-1 rounded-md ${
            selectAllValue ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={selectAllFunc}
        >
          Select All
        </button>
        <button
          className="text-white col-span-1 bg-red-500 rounded-md"
          onClick={() => {
            if (!tasksArrayObjects.length) {
              toast.error("No Tasks To Delete !");
              return;
            }
            if (confirm("Are You Sure Delete All Tasks ?")) {
              setcompletedArray([]);
              setNewTasksArray([]);
              setOptionsValue(false);
              selectAllFunc();
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
          id="inputTask"
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
        detailsValue={detailsValue}
        setNewTasksArray={setNewTasksArray}
        moveValue={moveValue}
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
                  detailsValue={detailsValue}
                  moveValue={moveValue}
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
      <ToastContainer hideProgressBar />
    </>
  );
}
