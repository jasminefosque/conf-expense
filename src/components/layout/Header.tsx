import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { uiActions } from '@/app/uiSlice';
import { selectPricing, selectTotalItemCount } from '@/app/selectors';
import { formatCurrency } from '@/domain/formatters';
import { Button } from '@/components/ui/Button';
import { clearPersistedState } from '@/app/store';
import { venueActions } from '@/features/venue/venueSlice';
import { addonsActions } from '@/features/addons/addonsSlice';
import { mealsActions } from '@/features/meals/mealsSlice';
import { promoActions } from '@/features/promo/promoSlice';

export function Header() {
  const dispatch = useAppDispatch();
  const pricing = useAppSelector(selectPricing);
  const totalItems = useAppSelector(selectTotalItemCount);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShowDetails = () => {
    dispatch(uiActions.openDetailsModal());
  };

  const handleSave = () => {
    dispatch(uiActions.addToast({ message: 'Plan saved successfully', type: 'success' }));
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all selections? This cannot be undone.')) {
      dispatch(venueActions.reset());
      dispatch(addonsActions.reset());
      dispatch(mealsActions.reset());
      dispatch(promoActions.reset());
      clearPersistedState();
      dispatch(uiActions.addToast({ message: 'Plan reset successfully', type: 'info' }));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Conference Planner
          </h1>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('venue')}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Venue
            </button>
            <button
              onClick={() => scrollToSection('addons')}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Add-ons
            </button>
            <button
              onClick={() => scrollToSection('meals')}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Meals
            </button>
          </nav>

          {/* Summary and Actions */}
          <div className="flex items-center gap-4">
            {/* Live Summary */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{totalItems}</span> items
              </div>
              <div className="font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(pricing.grandTotal)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
              <Button size="sm" onClick={handleShowDetails}>
                Show Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
