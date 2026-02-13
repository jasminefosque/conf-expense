import type { InputHTMLAttributes } from 'react';
import { forwardRef, useId } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    return (
      <label htmlFor={inputId} className="flex items-center gap-2 cursor-pointer group">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={`w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 select-none">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
