"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import React from "react";

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
