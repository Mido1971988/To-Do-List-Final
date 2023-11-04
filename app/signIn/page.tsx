import Login from "@/components/Login";
import { Modal } from "@/components/Modal";
import React from "react";

// when redirect : true in signIn (in Login.tsx) next-auth will add callbackUrl & error to searchparams if redirect : false will not add then
type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignInPage = (props: Props) => {
  return (
    <Modal>
      <Login
        error={props.searchParams?.error}
        callbackUrl={props.searchParams?.callbackUrl}
      />
    </Modal>
  );
};

export default SignInPage;
