import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ className = '', label, ...props }: InputProps) {
  return (
    <div className={clsx('w-full flex flex-col gap-1', className)}>
      {label && <label className="text-gray-500 px-3 text-sm font-medium">{label}</label>}
      <input
        className={clsx(
          'border border-gray-300 rounded-lg px-4 py-2',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all duration-200',
          props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
          className
        )}
        {...props}
      />
    </div>
  );
}
