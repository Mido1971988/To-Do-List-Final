import TaskButtons from "./taskButtons";

export default function NewTask({
  taskObject,
  onRender,
}: {
  taskObject: {
    id: number;
    time: string | undefined;
    text: string;
    done: boolean;
    delete: boolean;
    showDetails: boolean;
  };
  onRender: (arg: number | boolean, fromComp: string) => void;
}) {
  return (
    <>
      {taskObject.showDetails ? (
        <div className=" grid grid-cols-4 gap-4 bg-white p-2 rounded-md w-full relative before:content-[''] before:absolute  before:h-5 before:w-5 before:rounded-full before:bg-green-600 before:top-[calc(50%-10px)] before:-left-[25px]">
          <div className=" text-md font-bold font-sans col-span-4">
            ID : <span className=" font-medium">{taskObject.id}</span>
            <br />
            Created at : <span className=" font-medium">{taskObject.time}</span>
          </div>
        </div>
      ) : (
        <TaskButtons taskObject={taskObject} onRender={onRender} />
      )}
    </>
  );
}
