"use client";

import React from "react";

export default function OptionsOne({
  onRender,
}: {
  onRender: (arg: number | boolean, fromComp: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 m-auto w-6/12 gap-60 mt-5">
      <button className=" text-black justify-items-start  bg-green-500 rounded-md">
        Move
      </button>
      <button
        className=" text-black justify-items-end bg-green-500 rounded-md"
        onClick={() => onRender(false, "options-select")}
      >
        Select
      </button>
    </div>
  );
}
