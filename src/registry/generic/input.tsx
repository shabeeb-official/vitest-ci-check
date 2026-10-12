import { customEvent } from "@/utils/events";
import React from "react";

type InputProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  eventName?: string;
};

const Input = (props: InputProps) => {
  const { className, placeholder, value, type, eventName } = props;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    customEvent.publish(eventName, {
      value: e.target.value,
    });
  };

  return (
    <input
      type={type}
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
