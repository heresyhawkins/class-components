import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'px-6 py-2 rounded-lg font-semibold text-white',
        'transition-all duration-200',
        'hover:shadow-md active:scale-95',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100',
        props.type === 'submit' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600',
        className
      )}
      {...props}
    />
  );
}
