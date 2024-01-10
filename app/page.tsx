"use client";

import NewTask from "@/components/NewTask";
import Options from "@/components/Options";
import SigninButton from "@/components/SigninButton";
import ServerButton from "@/components/ServerButton";
import { useState, useRef, useEffect } from "react";
import { TaskObject } from "@/types/TaskObject.types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setOptionsValue } from "../redux/features/slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import AllTasks from "@/components/AllTasks";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import * as Yup from "yup";

export default function Home() {
  // Hook for tasks
  let [newTasksArray, setNewTasksArray] = useState<TaskObject[]>([]);

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
    const abortController = new AbortController();
    if (status === "authenticated") {
      toast
        // .promise(fetch("http://localhost:3500/tasks"), {
        .promise(fetch("/api/tasks", { signal: abortController.signal }), {
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
    return () => {
      abortController.abort();
    };
  }, [status]);

  // to Load Tasks when Load Button Clicked
  useEffect(() => {
    const abortController = new AbortController();
    if (skipInitialRender.current) {
      if (session?.user) {
        toast
          // .promise(fetch("http://localhost:3500/tasks"), {
          .promise(fetch("/api/tasks", { signal: abortController.signal }), {
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
    return () => {
      abortController.abort();
    };
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
    if (typeof arg === "number" && mission === "deleteTask") {
      setUpdateDeleted(arg);
    } else if (typeof arg === "number" && mission === "completed") {
      let filteredCompletedTasksArray = noOfCompleted(newTasksArray);
      setcompletedArray(filteredCompletedTasksArray);
    } else if (typeof arg === "boolean" && mission === "options") {
      if (!arg && !selectAllValue) {
        selectAllFunc();
      } else if (!arg && selectAllValue) {
        tasksArrayObjects.map((taskObject) => {
          taskObject.selected = false;
        });
      }
    } else if (typeof arg === "number" && mission === "loading") {
      setLoading(arg);
    } else if (typeof arg === "number" && mission === "moveUp") {
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
    } else if (typeof arg === "number" && mission === "moveDown") {
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
    }
  };

  // Input function
  let insertInput = () => {
    if (inputRef.current?.value === "") {
      inputRef.current.placeholder = "  You can't add Empty Task";
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

  // type for Fromik
  interface MyFormValues {
    inputTask: string;
  }

  // onSbmit Function for Formik
  const onSubmitFormik = (
    values: MyFormValues,
    helpers: FormikHelpers<MyFormValues>
  ) => {
    let taskObject = {
      id: Date.now(),
      time: new Date()
        ?.toString()
        ?.match(/\w+ \d+ \d+ \d+:\d+:\d+/gi)
        ?.join(""),
      text: values.inputTask ? values.inputTask : "no Input",
      done: false,
      delete: false,
      edited: false,
      editedTime: "",
      selected: false,
      up: false,
      down: false,
    };
    helpers.resetForm();
    tasksArrayObjects.unshift(taskObject);
    setNewTasksArray(tasksArrayObjects);
  };

  // Select All on click Function
  let selectAllFunc = () => {
    if (!tasksArrayObjects.length) {
      toast.error("No Tasks to Select !");
      return;
    }
    if (selectAllValue) {
      if (!optionsValue) return;
      tasksArrayObjects.map((taskObject) => (taskObject.selected = true));
      setSelectAllValue(false);
    } else if (!selectAllValue) {
      tasksArrayObjects.map((taskObject) => {
        taskObject.selected = false;
      });
      setSelectAllValue(true);
    }
  };

  // Redux Toolkit
  const dispatch = useDispatch<AppDispatch>();
  const optionsValue = useAppSelector((state) => state.myReducer.optionsValue);
  const moveValue = useAppSelector((state) => state.myReducer.moveValue);
  const detailsValue = useAppSelector((state) => state.myReducer.detailsValue);

  // Formik
  const initialValues = { inputTask: "" };

  // Yup Validation
  const validationSchema = Yup.object({
    inputTask: Yup.string().required("Valid Task Required!"),
  });

  return (
    <>
      {/* Check Server Button */}
      <ServerButton />

      {/* To Do List Title */}
      <h1 className=" text-red-600 text-[40px] font-black font-serif text-center mt-5 max-sm:text-[24px]">
        To Do List
      </h1>

      {/* Sign In and Sign Up Buttons */}
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
      <div className="grid grid-cols-2 w-11/12 m-auto mt-5">
        <div className=" flex gap-3 justify-center">
          <div className=" text-black max-sm:text-[12px] max-sm:leading-6">
            no. of Tasks
          </div>
          <div className=" text-black bg-red-500 rounded-full flex justify-center items-center w-6 h-6 max-sm:w-4 max-sm:h-4 max-sm:text-[12px]">
            {newTasksArray.length}
          </div>
        </div>
        <div className=" flex gap-3 justify-center">
          <div className=" text-black max-sm:text-[12px] max-sm:leading-6">
            no. of Completed
          </div>
          <div className=" text-black bg-green-500 rounded-full flex justify-center items-center w-6 h-6 max-sm:w-4 max-sm:h-4 max-sm:text-[12px]">
            {completedArray.length}
          </div>
        </div>
      </div>

      {/* Select All & Delete All */}
      <div className="grid grid-cols-2 w-11/12 m-auto mt-5 gap-20 pl-5 pr-5 max-sm:text-[12px]">
        <button
          ref={selectAllRef}
          className={`text-white col-span-1 rounded-md ${
            selectAllValue ? "bg-green-500" : "bg-red-500"
          }  `}
          onClick={selectAllFunc}
        >
          {selectAllValue ? "Select All" : "Deselect All"}
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
              dispatch(
                setOptionsValue({
                  optionsValue: false,
                  moveValue: false,
                  detailsValue: false,
                  // listOfUsers: [],
                })
              );
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
      {/* Using Formik */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitFormik}
        validationSchema={validationSchema}
      >
        <Form className="relative">
          <div className=" grid grid-cols-3 gap-4 w-11/12 m-auto mt-5 p-5 bg-slate-100 rounded-md max-sm:text-[12px] ">
            <Field id="inputTask" name="inputTask">
              {(props: FieldProps) => {
                const { field, form, meta } = props;
                return (
                  <input
                    {...field}
                    type="text"
                    placeholder={
                      meta.touched && meta.error
                        ? "Please write a Valid Task!"
                        : "Write your Task!"
                    }
                    className=" text-black outline-none col-span-2 rounded-md "
                  ></input>
                );
              }}
            </Field>
            <button
              className="text-white col-span-1 bg-green-500 rounded-md max-sm:text-[12px] max-sm:leading-6"
              type="submit"
            >
              Add Task
            </button>
            <ErrorMessage name="inputTask">
              {(error) => (
                <div className="error text-red-500 absolute bottom-0">
                  {error}
                </div>
              )}
            </ErrorMessage>
          </div>
        </Form>
      </Formik>

      {/* Without using Formik */}
      {/* <div className=" grid grid-cols-3 gap-4 w-11/12 m-auto mt-5 p-5 bg-slate-100 rounded-md max-sm:text-[12px]">
        <input
          id="inputTask"
          type="text"
          placeholder="   Write your Task!"
          className=" text-black outline-none col-span-2 rounded-md "
          ref={inputRef}
        ></input>
        <button
          className="text-white col-span-1 bg-green-500 rounded-md max-sm:text-[12px] max-sm:leading-6"
          onClick={insertInput}
        >
          Add Task
        </button>
      </div> */}

      {/* Options */}
      <Options
        renderMainPage={renderMainPage}
        tasks={tasksArrayObjects}
        setNewTasksArray={setNewTasksArray}
      />

      {/* All Tasks */}
      <AllTasks tasks={tasksArrayObjects} renderMainPage={renderMainPage} />

      {/* needed for Toast */}
      <ToastContainer hideProgressBar draggable={false} />
    </>
  );
}
