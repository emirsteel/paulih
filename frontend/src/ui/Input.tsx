import React from "react";

export interface InputAsInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  as?: "input";
  placeholder: string;
}

export interface InputAsTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  id: string;
  as: "textarea";
  placeholder: string;
}

export type InputProps = InputAsInputProps | InputAsTextareaProps;

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  as = "input",
  ...rest
}) => {
  if (as === "textarea") {
    return (
      <div className="relative w-full">
        <textarea
          id={id}
          className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 transition peer"
          placeholder=" " // Empty placeholder for floating effect
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        ></textarea>
        <label
          htmlFor={id}
          className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
            ${value ? "-top-2 text-blue-600" : "top-3 text-gray-400"}
            peer-focus:-top-2 peer-focus:text-blue-600 peer-focus:bg-white`}
        >
          {placeholder}
        </label>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        type={
          (rest as React.InputHTMLAttributes<HTMLInputElement>).type || "text"
        }
        id={id}
        className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 transition peer"
        placeholder=" " // Empty placeholder for floating effect
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
          ${value ? "-top-2 text-blue-600" : "top-3 text-gray-400"}
          peer-focus:-top-2 peer-focus:text-blue-600 peer-focus:bg-white`}
      >
        {placeholder}
      </label>
    </div>
  );
};

export default Input;
