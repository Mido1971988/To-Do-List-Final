import { TaskObject } from "@/types/TaskObject.types";
import NewTask from "./NewTask";
import { useAppSelector } from "@/redux/store";

export default function AllTasks({
  tasks,
  renderMainPage,
}: {
  tasks: TaskObject[];
  renderMainPage: (arg: number | boolean, mission: string) => void;
}) {
  // Redux Toolkit
  const optionsValue = useAppSelector((state) => state.myReducer.optionsValue);
  const moveValue = useAppSelector((state) => state.myReducer.moveValue);
  const detailsValue = useAppSelector((state) => state.myReducer.detailsValue);
  return (
    <>
      <div className=" flex flex-col items-center justify-center w-screen gap-1 mt-5 ">
        <div className="w-11/12 bg-slate-100 p-5">
          <div className=" flex flex-col items-center justify-center gap-5 ">
            {tasks.length ? (
              tasks.map((taskObject) => (
                <NewTask
                  key={taskObject.id}
                  renderMainPage={renderMainPage}
                  taskObject={taskObject}
                  optionsValue={optionsValue}
                  detailsValue={detailsValue}
                  moveValue={moveValue}
                />
              ))
            ) : (
              <div className=" text-slate-400 bg-white w-full text-center font-bold max-sm:text-[12px] rounded-md h-7 leading-7 ">
                NO TASKS
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
