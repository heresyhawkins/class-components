import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Checkbox({ className, label, ...props }: CheckboxProps) {
  return (
    <div className={clsx('w-full px-3', className)}>
      <label className="group flex items-center gap-3 cursor-pointer select-none">
        <input type="checkbox" className="peer sr-only" {...props} />
        <span
          className={clsx(
            'h-5 w-5 border-2 border-gray-400 rounded',
            'flex items-center justify-center',
            'peer-checked:bg-blue-500 peer-checked:border-blue-500',
            'transition-colors duration-200'
          )}
        ></span>
        <span className="font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
      </label>
    </div>
  );
}
