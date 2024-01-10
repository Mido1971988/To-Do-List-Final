// import { fetchUsers } from "@/redux/features/slice";
// import { AppDispatch, useAppSelector } from "@/redux/store";
import React, { useState } from "react";
// import { useDispatch } from "react-redux";

const ServerButton = () => {
  const [serverStatus, setServerStatus] = useState(false);
  const [clicked, setClicked] = useState(false);

  // this just an Example to try Async Reducer
  // const dispatch = useDispatch<AppDispatch>();
  // const listOfU = useAppSelector((state) => state.myReducer.listOfUsers);

  // to check if Server Online or Not
  let handleServer = async () => {
    // this just an Example to try Async Reducer
    // dispatch(fetchUsers());

    // const response = await fetch("http://localhost:3500/listOfUsers");
    const response = await fetch("api/listOfUsers");
    if (response.ok) {
      setClicked(true);
      setServerStatus(true);
    } else {
      setClicked(true);
      setServerStatus(false);
    }
  };
  return (
    <button
      className={` font-serif rounded-md  mt-5  max-sm:w-24 max-sm:text-[12px] w-32 ${
        clicked ? "text-black " : "text-white bg-green-500 "
      }`}
      onClick={handleServer}
      disabled={clicked}
    >
      {clicked
        ? serverStatus
          ? "Server is 🟢"
          : "Server is 🔴"
        : "Check Server"}
    </button>
  );
};

export default React.memo(ServerButton);
