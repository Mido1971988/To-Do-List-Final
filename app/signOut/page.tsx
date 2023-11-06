"use client";

import { signOut } from "next-auth/react";
import { Modal } from "@/components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  return (
    <Modal>
      <div>
        <div className="bg-gradient-to-b  from-slate-50 to-slate-200 p-2 text-center text-slate-600">
          Sign Out
        </div>
        <div className="p-2 flex flex-col gap-3">
          <div className="flex items-center justify-center mt-2 gap-2">
            <button
              type="submit"
              className="w-28 border border-green-600 text-center py-2 rounded-md text-white-600 transition hover:bg-green-600 hover:text-white hover:border-transparent active:scale-95"
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
            >
              Sign Out
            </button>
            <Link
              href={"/"}
              className="w-28 border border-red-600 text-center py-2 rounded-md text-red-600 transition hover:bg-red-600 hover:text-white hover:border-transparent active:scale-95"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignOut;
