"use client";
import React, { useRef, useState } from "react";
import InputBox from "./InputBox";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
      <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
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
      </form>
    </div>
  );
};

export default Login;
