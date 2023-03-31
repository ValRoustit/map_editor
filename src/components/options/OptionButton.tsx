import { ButtonHTMLAttributes } from "react";

export default function OptionButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { children, disabled, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      className={`text-transform: inline-flex items-center justify-center gap-2 border border-transparent px-2 py-2 text-xs font-semibold uppercase text-gray-500 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800 ${
        disabled ? "cursor-not-allowed bg-gray-200" : ""
      }`}
    >
      {children}
    </button>
  );
}
