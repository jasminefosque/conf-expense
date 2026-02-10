import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { uiActions } from '@/app/uiSlice';

export function ToastContainer() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (toasts.length === 0) return;

    const timer = setTimeout(() => {
      dispatch(uiActions.removeToast(toasts[0].id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white max-w-md animate-slide-in ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-blue-600'
          }`}
          role="alert"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => dispatch(uiActions.removeToast(toast.id))}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close notification"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
