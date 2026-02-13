interface StepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  label?: string;
}

export function Stepper({ value, onIncrement, onDecrement, min = 0, label }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={label ? `Decrease ${label}` : 'Decrease'}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="min-w-[2rem] text-center font-medium text-gray-900 dark:text-gray-100">
        {value}
      </span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
        aria-label={label ? `Increase ${label}` : 'Increase'}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
