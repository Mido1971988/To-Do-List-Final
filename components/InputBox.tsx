import { TextField } from "@mui/material";
import { FieldInputProps } from "formik";
import React, { useState } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  labelText?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  field?: FieldInputProps<any>;
  isTouched?: boolean;
}

const InputBox = ({
  labelText,
  inputRef,
  field,
  isTouched,
  ...props
}: Props) => {
  return (
    <div className={props.className}>
      {/* With Material UI */}
      <TextField
        label={labelText}
        className={`w-full`}
        inputRef={inputRef}
        error={isTouched ? true : false}
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
        className={`border  rounded-md disabled:border-slate-100 w-full block outline-none py-2 px-1 transition-all text-xs lg:text-sm xl:text-base  bg-slate-50 focus:shadow focus:shadow-blue-500`}
        {...field}
        {...props}
      ></input> */}
    </div>
  );
};

export default InputBox;
