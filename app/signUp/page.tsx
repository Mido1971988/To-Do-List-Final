"use client";

import InputBox from "@/components/InputBox";
import { Modal } from "@/components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  callbackUrl?: string;
  error?: string;
};

const signUp = (props: Props) => {
  let userName = "";
  let passWord = "";
  const router = useRouter();

  let onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("http://localhost:3500/listOfUsers")
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
          fetch("http://localhost:3500/listOfUsers", {
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
              router.push("http://localhost:3000");
            })
            .catch((err) => console.log(err));
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
        <form onSubmit={onSubmit} className="p-2 flex flex-col gap-3">
          <InputBox
            name="username"
            labelText="User Name"
            onChange={(e) => (userName = e.target.value)}
          />
          <InputBox
            name="password"
            type="password"
            labelText="Password"
            onChange={(e) => (passWord = e.target.value)}
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
        </form>
      </div>
    </Modal>
  );
};

export default signUp;
