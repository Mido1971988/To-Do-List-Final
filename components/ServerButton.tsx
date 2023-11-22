import React from "react";

const ServerButton = () => {
  // to check if Server Online or Not
  let handleServer = (e: React.MouseEvent) => {
    (async (ele) => {
      try {
        // const response = await fetch("http://localhost:3500/listOfUsers");
        const response = await fetch("api/listOfUsers");
        if (response.ok) {
          ele.classList.remove("bg-green-500");
          ele.classList.remove("text-white");
          ele.classList.add("text-black");
          ele.innerHTML = `Server is 🟢`;
          ele.setAttribute("disabled", "true");
        }
      } catch (error) {
        ele.classList.remove("bg-green-500");
        ele.classList.remove("text-white");
        ele.classList.add("text-black");
        ele.innerHTML = `Server is 🔴`;
      }
    })(e.currentTarget);
  };
  return (
    <button
      className=" text-white font-serif rounded-md  mt-5 bg-green-500 max-sm:w-24 max-sm:text-[12px] w-32 "
      onClick={(e) => handleServer(e)}
    >
      Check Server
    </button>
  );
};

export default React.memo(ServerButton);
