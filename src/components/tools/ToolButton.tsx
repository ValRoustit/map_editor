import { InputHTMLAttributes, ReactNode } from "react";

export interface ToolButtonProps extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode;
  title: string;
}

export default function ToolButton(props: ToolButtonProps) {
  const { children, className, title, ...rest } = props;
  return (
    <div>
      <input id={title} type="radio" className="peer" {...rest} />
      <label
        htmlFor={title}
        title={title}
        className={`inline-flex min-w-full cursor-pointer items-center justify-center rounded-sm px-4 py-4 text-gray-500 transition-all hover:bg-gray-200 peer-checked:bg-gray-500 peer-checked:text-gray-100 ${className}`}
      >
        {children}
      </label>
    </div>
  );
}
