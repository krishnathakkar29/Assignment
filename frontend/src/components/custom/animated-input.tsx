import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function AnimatedInput({
  className = "",
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(!!props.value);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  return (
    <div
      className={`relative group ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        className={`absolute inset-0 rounded-md transition-all duration-300 ${
          isFocused
            ? "border-2 border-primary/50 shadow-[0_0_15px_rgba(var(--primary)/0.3)]"
            : "border border-border/50"
        }`}
      ></div>
      <Input
        {...props}
        ref={inputRef}
        className={`relative bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 ${
          isFocused || hasValue ? "pl-4" : "pl-10"
        } transition-all duration-300`}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
      />
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-300 ${
          isFocused || hasValue ? "opacity-0 -translate-x-4" : "opacity-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
    </div>
  );
}
