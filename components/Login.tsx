"use client";
import React, { useRef, useState } from "react";
import InputBox from "./InputBox";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FieldProps,
} from "formik";
import * as Yup from "yup";
import { error } from "console";

// will be be props only if redirect : true in signIn (in Login.tsx)
type Props = {
  className?: string;
  callbackUrl?: string;
  error?: string;
};

const Login = (props: Props) => {
  const router = useRouter();
  let userName = "";
  let pass = "";
  // refs to Clear Input Fields after Signing in
  let userInput = useRef<HTMLInputElement>(null);
  let passInput = useRef<HTMLInputElement>(null);

  let [unAuth, setUnAuth] = useState<boolean | string>(false);

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

  // to Handle Click on Sign In Button
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (userInput && userInput.current) userInput.current.value = "";
    if (passInput && passInput.current) passInput.current.value = "";
    e.preventDefault();

    // To Check if failed to fecth from external Api or your own Api Endpoint
    let usersResponse;
    try {
      // usersResponse = await fetch("http://localhost:3500/listOfUsers");
      usersResponse = await fetch("api/listOfUsers");
    } catch (e) {
      console.log((e as Error).message);
    }
    if (!usersResponse?.ok) {
      toast.error("Failed To Fetch Users");
      setUnAuth("Failed To Fetch Users");
      return;
    }

    await signIn("credentials", {
      username: userName,
      password: pass,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        toast.error("User and Pass are wrong");
        setUnAuth("User and Pass are wrong");
      } else {
        setUnAuth(false);
        router.push(props.callbackUrl ?? "/");
      }
    });
  };

  // to Handle Click on Sign In Button with Formik
  const onSubmitFormik = async (
    values: MyFormValues,
    helpers: FormikHelpers<MyFormValues>
  ) => {
    // to Clear Field after submit or failed of Authentication
    helpers.resetForm();

    // To Check if failed to fecth from external Api or your own Api Endpoint
    let usersResponse;
    try {
      // usersResponse = await fetch("http://localhost:3500/listOfUsers");
      usersResponse = await fetch("api/listOfUsers");
    } catch (e) {
      console.log((e as Error).message);
    }
    if (!usersResponse?.ok) {
      toast.error("Failed To Fetch Users");
      setUnAuth("Failed To Fetch Users");
      return;
    }

    await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    }).then((res) => {
      if (res?.error) {
        toast.error("User and Pass are wrong");
        setUnAuth("User and Pass are wrong");
      } else {
        setUnAuth(false);
        router.push(props.callbackUrl ?? "/");
      }
    });
  };

  return (
    <div className={props.className}>
      <div className="bg-gradient-to-b  from-slate-50 to-slate-200 p-2 text-center text-slate-600">
        Login Form
      </div>
      {/* {!!props.error && (
        <p className="bg-red-100 text-red-600 text-center p-2">
          Authentication Failed
        </p>
      )} */}
      {unAuth && (
        <p className="bg-red-100 text-red-600 text-center p-2">{unAuth}</p>
      )}

      {/* if you want to disable autofocus (because of using Modal) wrap Form Component with <div tabIndex={3}></div> */}

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
                      inputRef={userInput}
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
                      inputRef={passInput}
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
                Sign In
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

      {/* without Formik */}

      {/* <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
        <InputBox
          name="username"
          labelText="User Name"
          inputRef={userInput}
          onChange={(e) => (userName = e.target.value)}
        />
        <InputBox
          name="password"
          type="password"
          labelText="Password"
          inputRef={passInput}
          onChange={(e) => (pass = e.target.value)}
        />
        <div className="flex items-center justify-center mt-2 gap-2">
          <button
            type="submit"
            className="w-28 border border-green-600 text-center py-2 rounded-md text-white-600 transition hover:bg-green-600 hover:text-white hover:border-transparent active:scale-95"
          >
            Sign In
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
  );
};

export default Login;
