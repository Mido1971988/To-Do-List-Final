"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="text-green-600 text-6 font-black font-serif justify-center mt-5 flex gap-4">
        <p className="text-green-600">{session.user.name}</p>
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <Link
      href={"/signIn"}
      className="text-green-600 text-6 font-black font-serif text-center mt-5"
      scroll={false}
    >
      Sign In
    </Link>
  );
};

export default SigninButton;
