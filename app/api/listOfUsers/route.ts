import { NextResponse } from "next/server";
// Webpack will bundle the JSON for you at build time so listOfUsers will be regular js object
import listOfUsers from "@/myData/listOfUsers.json";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  return NextResponse.json(listOfUsers, { status: 200 });
}

export async function POST(request: Request) {
  const res = await request.json();
  let jsonReq = JSON.stringify(res);
  await fs.writeFile(
    process.cwd() + "/myData/listOfUsers.json",
    jsonReq,
    "utf8"
  );
  return Response.json("List Of User Updated!");
}
