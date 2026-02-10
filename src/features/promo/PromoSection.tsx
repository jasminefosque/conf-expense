import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { promoActions } from './promoSlice';
import { selectPlanState } from '@/app/selectors';
import { validatePromoCode, canApplyPromo } from '@/domain/promoCodes';
import { calculatePromoDiscount } from '@/domain/pricingEngine';
import { formatCurrency } from '@/domain/formatters';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { uiActions } from '@/app/uiSlice';

export function PromoSection() {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const appliedPromo = useAppSelector((state) => state.promo.applied);
  const planState = useAppSelector(selectPlanState);

  const handleApply = () => {
    setError('');

    const validation = validatePromoCode(input);

    if (!validation.valid) {
      setError(validation.error || 'Invalid promo code');
      return;
    }

    const promo = validation.promo!;
    const discount = calculatePromoDiscount(promo, planState);

    if (!discount) {
      const targetSubtotal =
        promo.type === 'venue'
          ? Object.entries(planState.venueQuantities).reduce((sum, [, qty]) => sum + qty, 0)
          : promo.type === 'addons'
            ? Object.entries(planState.addonQuantities).reduce((sum, [, qty]) => sum + qty, 0)
            : planState.meals.people;

      const { reason } = canApplyPromo(
        promo,
        targetSubtotal,
        promo.type === 'meals' ? { people: planState.meals.people } : undefined
      );
      setError(reason || 'Promo code cannot be applied');
      return;
    }

    dispatch(promoActions.setPromoCode(promo.code));
    dispatch(promoActions.applyPromo(discount));
    dispatch(uiActions.addToast({ message: `Promo code ${promo.code} applied!`, type: 'success' }));
    setInput('');
  };

  const handleClear = () => {
    dispatch(promoActions.clearPromo());
    dispatch(uiActions.addToast({ message: 'Promo code removed', type: 'info' }));
    setInput('');
    setError('');
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Promo Code
        </h3>

        {appliedPromo ? (
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    {appliedPromo.code}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Discount: {formatCurrency(appliedPromo.discountAmount)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApply();
                  }
                }}
                error={error}
              />
              <Button onClick={handleApply} disabled={!input.trim()}>
                Apply
              </Button>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>Available codes:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>EARLYBIRD10 - 10% off venue</li>
                <li>AVBUNDLE5 - 5% off add-ons ($500+ subtotal)</li>
                <li>CATER15 - 15% off meals (50+ people)</li>
              </ul>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
