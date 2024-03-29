"use client";
import { useState } from "react";
import { TaskObject } from "@/types/TaskObject.types";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { setOptionsValue } from "@/redux/features/slice";

export default function Options({
  renderMainPage,
  tasks,
  setNewTasksArray,
}: {
  renderMainPage: (arg: number | boolean, fromComp: string) => void;
  tasks: TaskObject[];
  setNewTasksArray: React.Dispatch<React.SetStateAction<TaskObject[]>>;
}) {
  let [completeButton, setCompleteButton] = useState(true);
  let { data: session, status } = useSession();

  // Redux Toolkit
  const dispatch = useDispatch<AppDispatch>();
  const optionsValue = useAppSelector((state) => state.myReducer.optionsValue);
  const moveValue = useAppSelector((state) => state.myReducer.moveValue);
  const detailsValue = useAppSelector((state) => state.myReducer.detailsValue);

  // to Check no. of selected tasks
  let selectedCheck = () => {
    let selectedTasks = tasks.filter((task) => {
      if (task.selected) return true;
    });
    if (selectedTasks.length === 0) {
      dispatch(
        setOptionsValue({
          optionsValue: optionsValue,
          moveValue: moveValue,
          detailsValue: false,
          // listOfUsers: [],
        })
      );
    }
    return selectedTasks;
  };

  // swap Function
  let swapFunc = () => {
    let selectedTasks = selectedCheck();
    if (selectedTasks.length === 2) {
      let swapIndex: number[] = [];
      tasks.map((task, indx) => {
        if (task.selected) swapIndex.push(indx);
      });
      [tasks[swapIndex[0]], tasks[swapIndex[1]]] = [
        tasks[swapIndex[1]],
        tasks[swapIndex[0]],
      ];
      setNewTasksArray(tasks);
    }
  };

  // complete Function
  let completeFunc = () => {
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
  };

  // Save Button Function
  let handleSaveClick = () => {
    if (status === "authenticated" && session && session.user) {
      let userName = session?.user.name;
      let reqBody = [userName, tasks];
      // fetch("http://localhost:3500/tasks", {
      fetch("api/tasks", {
        method: "post",
        mode: "cors",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed");
          toast(`${userName}'s Task Saved ✅`);
          return res.text();
        })
        .then(console.log)
        .catch((err) => console.log(err));
    } else {
      toast.error("No User Signed In! ⛔️ ");
    }
  };

  return (
    <>
      {optionsValue ? (
        <div className="grid grid-cols-5 m-auto w-3/4 gap-1 mt-5 max-sm:text-[12px]">
          <button
            className=" text-black bg-green-500 rounded-md"
            onClick={swapFunc}
          >
            Swap
          </button>
          <button
            className={`text-black rounded-md ${
              completeButton ? "bg-green-500" : "bg-red-500"
            }`}
            onClick={completeFunc}
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
                dispatch(
                  setOptionsValue({
                    optionsValue: optionsValue,
                    moveValue: moveValue,
                    detailsValue: !detailsValue,
                    // listOfUsers: [],
                  })
                );
              }
            }}
          >
            {detailsValue ? "Details..." : "Details"}
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
            onClick={() => {
              dispatch(
                setOptionsValue({
                  optionsValue: false,
                  moveValue: moveValue,
                  detailsValue: false,
                  // listOfUsers: [],
                })
              );
              renderMainPage(false, "options");
            }}
          >
            Selecting
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 m-auto w-3/4 gap-5 mt-5 max-sm:text-[14px]">
          {moveValue ? (
            <button
              className=" text-white col-span-1 bg-red-500 rounded-md"
              onClick={() =>
                dispatch(
                  setOptionsValue({
                    optionsValue: optionsValue,
                    moveValue: false,
                    detailsValue: detailsValue,
                    // listOfUsers: [],
                  })
                )
              }
            >
              Moving...
            </button>
          ) : (
            <button
              className=" text-white col-span-1  bg-green-500 rounded-md"
              onClick={() => {
                if (!tasks.length) {
                  toast.error("No Tasks To Move!!");
                  return;
                }
                dispatch(
                  setOptionsValue({
                    optionsValue: optionsValue,
                    moveValue: true,
                    detailsValue: detailsValue,
                    // listOfUsers: [],
                  })
                );
              }}
            >
              Move
            </button>
          )}
          <button
            className=" text-white col-span-1 bg-green-500 rounded-md"
            onClick={handleSaveClick}
          >
            Save
          </button>
          <button
            className=" text-white col-span-1 bg-green-500 rounded-md"
            onClick={() => renderMainPage(Date.now(), "loading")}
          >
            Load
          </button>
          <button
            className=" text-white col-span-1 bg-green-500 rounded-md"
            onClick={() => {
              if (!tasks.length) {
                toast.warn("Add Tasks First!");
                return;
              }
              dispatch(
                setOptionsValue({
                  optionsValue: true,
                  moveValue: moveValue,
                  detailsValue: detailsValue,
                  // listOfUsers: [],
                })
              );
            }}
          >
            Select
          </button>
        </div>
      )}
    </>
  );
}
