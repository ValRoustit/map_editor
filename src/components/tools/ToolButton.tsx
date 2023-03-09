import { HTMLAttributes, ReactNode } from "react";

export interface ToolButtonProps extends HTMLAttributes<HTMLElement> {
  name: string;
  id: string;
  children: ReactNode;
}

export default function ToolButton(props: ToolButtonProps) {
  const { name, id, children, ...rest } = props;
  return (
    <>
      <input type="radio" name={name} id={id} {...rest} />
      <label htmlFor={id}>{children}</label>
    </>
  );
}
