"use client";

import InputBox from "@/components/InputBox";
import { Modal } from "@/components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import * as Yup from "yup";

// Formik
const initialValues = { username: "", password: "" };

// type for Fromik
interface MyFormValues {
  username: string;
  password: string;
}

// Yup Validation
const validationSchema = Yup.object({
  username: Yup.string().required("Required!"),
  password: Yup.string().required("Required!"),
});

type Props = {
  className?: string;
  callbackUrl?: string;
  error?: string;
};

const signUp = (props: Props) => {
  let userName = "";
  let passWord = "";
  // refs to Clear Input Fields after Signing Up
  let userInput = useRef<HTMLInputElement>(null);
  let passInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Click on Sign Up Button
  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userInput && userInput.current) userInput.current.value = "";
    if (passInput && passInput.current) passInput.current.value = "";
    // fetch("http://localhost:3500/listOfUsers")
    fetch("api/listOfUsers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to Fetch");
        }
        return res.json();
      })
      .then((res) => {
        if (userName === "" || passWord === "") {
          window.alert("Please Add username and Password");
          return;
        }
        let foundUser = res.filter(
          (user: { id: string; name: string; password: string }) =>
            user.name === userName
        );
        if (!foundUser.length) {
          let newUser = {
            id: Date.now().toString(),
            name: userName,
            password: passWord,
          };
          res.push(newUser);
          fetch("api/listOfUsers", {
            method: "post",
            mode: "cors",
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(res),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed");
              return res.text();
            })
            .then((res) => {
              console.log(res);
              router.push("/");
            })
            .catch((err) => console.log(err));
        } else {
          toast.error(`User ${foundUser[0].name} Already Exists`);
          router.push("/");
        }
      })
      .catch((err) => console.log("Server not Running...."));
  };

  // to Handle Click on Sign In Button with Formik
  let onSubmitFormik = (
    values: MyFormValues,
    helpers: FormikHelpers<MyFormValues>
  ) => {
    fetch("api/listOfUsers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to Fetch");
        }
        return res.json();
      })
      .then((res) => {
        let foundUser = res.filter(
          (user: { id: string; name: string; password: string }) =>
            user.name === values.username
        );
        if (!foundUser.length) {
          let newUser = {
            id: Date.now().toString(),
            name: values.username,
            password: values.password,
          };
          res.push(newUser);
          fetch("api/listOfUsers", {
            method: "post",
            mode: "cors",
            headers: {
              Accept: "text/plain",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(res),
          })
            .then((res) => {
              if (!res.ok) throw new Error("Failed");
              return res.text();
            })
            .then((res) => {
              console.log(res);
              router.push("/");
            })
            .catch((err) => console.log(err));
        } else {
          toast.error(`User ${foundUser[0].name} Already Exists`);
          router.push("/");
        }
      })
      .catch((err) => console.log("Server not Running...."));
  };

  return (
    <Modal>
      <div className={props.className}>
        <div className="bg-gradient-to-b  from-slate-50 to-slate-200 p-2 text-center text-slate-600">
          Sign Up Form
        </div>

        {/* With Formik */}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmitFormik}
          validationSchema={validationSchema}
        >
          <div tabIndex={3}>
            <Form className="p-2 flex flex-col gap-6">
              <Field name="username" id="username">
                {(props: FieldProps) => {
                  const { field, form, meta } = props;
                  return (
                    <div className=" relative">
                      <InputBox
                        field={field}
                        labelText="User Name"
                        isTouched={meta.touched && !meta.value}
                      />
                      {meta.touched && !meta.value ? (
                        <ErrorMessage name="username">
                          {(error) => (
                            <div className="error text-red-500 absolute -bottom-4 text-xs right-0">
                              {error}
                            </div>
                          )}
                        </ErrorMessage>
                      ) : null}
                    </div>
                  );
                }}
              </Field>
              <Field name="password" id="password">
                {(props: FieldProps) => {
                  const { field, form, meta } = props;
                  return (
                    <div className=" relative">
                      <InputBox
                        field={field}
                        labelText="Password"
                        isTouched={meta.touched && !meta.value}
                      />
                      {meta.touched && !meta.value ? (
                        <ErrorMessage name="username">
                          {(error) => (
                            <div className="error text-red-500 absolute -bottom-4 text-xs right-0">
                              {error}
                            </div>
                          )}
                        </ErrorMessage>
                      ) : null}
                    </div>
                  );
                }}
              </Field>
              <div className="flex items-center justify-center mt-2 gap-2">
                <button
                  type="submit"
                  className="w-28 border border-green-600 text-center py-2 rounded-md text-white-600 transition hover:bg-green-600 hover:text-white hover:border-transparent active:scale-95"
                >
                  Sign Up
                </button>
                <Link
                  href={props.callbackUrl ?? "/"}
                  className="w-28 border border-red-600 text-center py-2 rounded-md text-red-600 transition hover:bg-red-600 hover:text-white hover:border-transparent active:scale-95"
                >
                  Cancel
                </Link>
              </div>
            </Form>
          </div>
        </Formik>

        {/* wihout Formik */}
        {/* <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
          <InputBox
            name="username"
            labelText="User Name"
            onChange={(e) => (userName = e.target.value)}
            inputRef={userInput}
          />
          <InputBox
            name="password"
            type="password"
            labelText="Password"
            onChange={(e) => (passWord = e.target.value)}
            inputRef={passInput}
          />
          <div className="flex items-center justify-center mt-2 gap-2">
            <button
              type="submit"
              className="w-28 border border-green-600 text-center py-2 rounded-md text-white-600 transition hover:bg-green-600 hover:text-white hover:border-transparent active:scale-95"
            >
              Sign Up
            </button>
            <Link
              href={props.callbackUrl ?? "/"}
              className="w-28 border border-red-600 text-center py-2 rounded-md text-red-600 transition hover:bg-red-600 hover:text-white hover:border-transparent active:scale-95"
            >
              Cancel
            </Link>
          </div>
        </form> */}
      </div>
    </Modal>
  );
};

export default signUp;
