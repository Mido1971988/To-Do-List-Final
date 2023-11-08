import { NextResponse } from "next/server";
import tasks from "../../../myData/tasks.json";
import { TaskObject } from "@/types/TaskObject.types";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  return NextResponse.json(tasks, { status: 200 });
}

export async function POST(request: Request) {
  const res = await request.json();
  const serverTasks = await fs.readFile(
    process.cwd() + "/myData/tasks.json",
    "utf8"
  );
  const tasksData = JSON.parse(serverTasks);
  let found = false;
  tasksData.map((task: { [key: string]: TaskObject[] }) => {
    if (task[res[0]]) {
      task[res[0]] = res[1];
      found = true;
    }
  });
  if (!found) tasksData.push({ [res[0]]: res[1] });
  await fs.writeFile(
    process.cwd() + "/myData/tasks.json",
    JSON.stringify(tasksData),
    "utf8"
  );
  return Response.json(`Tasks For user ${res[0]} Saved`);
}
