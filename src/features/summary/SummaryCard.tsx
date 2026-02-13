import { useAppSelector } from '@/app/hooks';
import { selectPricing, selectTotalItemCount } from '@/app/selectors';
import { formatCurrency } from '@/domain/formatters';
import { Card, CardBody } from '@/components/ui/Card';

export function SummaryCard() {
  const pricing = useAppSelector(selectPricing);
  const totalItems = useAppSelector(selectTotalItemCount);

  return (
    <Card className="sticky top-24">
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Items Selected</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
          </div>

          {pricing.venueSubtotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Venue</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(pricing.venueSubtotal)}
              </span>
            </div>
          )}

          {pricing.addonsSubtotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Add-ons</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(pricing.addonsSubtotal)}
              </span>
            </div>
          )}

          {pricing.mealsSubtotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Meals</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(pricing.mealsSubtotal)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(pricing.subtotal)}
              </span>
            </div>
          </div>

          {pricing.appliedPromo && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
              <span>Discount ({pricing.appliedPromo.code})</span>
              <span>-{formatCurrency(pricing.appliedPromo.discountAmount)}</span>
            </div>
          )}

          <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Total
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(pricing.grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
