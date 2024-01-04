import { TextField } from "@mui/material";
import { FieldInputProps } from "formik";
import React, { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  field?: FieldInputProps<any>;
}

const InputBox = ({ labelText, error, inputRef, field, ...props }: Props) => {
  return (
    <div className={props.className}>
      {/* With Material UI */}
      <TextField
        label={labelText}
        className={`w-full`}
        inputRef={inputRef}
        {...field}
      ></TextField>

      {/* Without Material UI */}
      {/* <label
        className={`block text-slate-600  mb-2 text-xs lg:text-sm xl:text-base `}
      >
        {labelText}
      </label>
      <input
        ref={inputRef}
        className={`border  rounded-md disabled:border-slate-100 w-full block outline-none py-2 px-1 transition-all text-xs lg:text-sm xl:text-base  bg-slate-50 focus:shadow focus:shadow-blue-500 
              ${
                error ? " border-red-500   animate-shake" : "border-slate-400"
              }`}
        {...field}
        {...props}
      ></input> */}
    </div>
  );
};

export default InputBox;
