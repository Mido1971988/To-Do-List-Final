export default function Home() {
  return (
    <>
      <h1 className=" text-red-600 text-[40px] font-black font-serif text-center mt-5">
        To Do List
      </h1>
      <div className="grid grid-cols-2 w-6/12 m-auto mt-5">
        <div className=" flex gap-3 justify-center">
          <div className=" text-black">no. of Tasks</div>
          <div className=" text-black bg-red-500 rounded-full flex justify-center items-center w-6 h-6">
            0
          </div>
        </div>
        <div className=" flex gap-3 justify-center">
          <div className=" text-black">no. of Completed</div>
          <div className=" text-black bg-green-500 rounded-full flex justify-center items-center w-6 h-6">
            0
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-3 gap-4 w-6/12 m-auto mt-5 p-5 bg-slate-100 rounded-md">
        <input
          type="text"
          placeholder="Write your Task!"
          className=" text-black outline-none col-span-2 rounded-md"
        ></input>
        <button className="text-black col-span-1 bg-green-500 rounded-md">
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-2 w-6/12 m-auto mt-5 gap-20 pl-5 pr-5">
        <button className="text-black col-span-1 bg-green-500 rounded-md">
          Select All
        </button>
        <button className="text-black col-span-1 bg-red-500 rounded-md">
          Delete All
        </button>
      </div>
      <div className=" flex flex-col items-center justify-center w-screen gap-1 mt-5">
        <div className=" w-6/12 bg-slate-100 p-5">
          <div className=" flex flex-col items-center justify-center gap-5 ">
            <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full">
              <div className=" text-black col-span-2">TASK One</div>
              <button className="text-black col-span-1 bg-green-500 rounded-md">
                Done
              </button>
              <button className="text-black col-span-1 bg-red-500 rounded-md">
                Edit
              </button>
            </div>
            <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full">
              <div className=" text-black col-span-2">TASK One</div>
              <button className="text-black col-span-1 bg-green-500 rounded-md">
                Done
              </button>
              <button className="text-black col-span-1 bg-red-500 rounded-md">
                Edit
              </button>
            </div>
            <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full">
              <div className=" text-black col-span-2">TASK One</div>
              <button className="text-black col-span-1 bg-green-500 rounded-md">
                Done
              </button>
              <button className="text-black col-span-1 bg-red-500 rounded-md">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
