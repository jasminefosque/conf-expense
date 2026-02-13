import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { uiActions } from '@/app/uiSlice';
import { selectPricing } from '@/app/selectors';
import { formatCurrency, formatQuantity } from '@/domain/formatters';
import { downloadFile, exportToCSV, exportToJSON } from '@/domain/exportUtils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function DetailsModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.detailsModalOpen);
  const pricing = useAppSelector(selectPricing);

  const handleClose = () => {
    dispatch(uiActions.closeDetailsModal());
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(pricing);
    downloadFile(csv, 'conference-expense-plan.csv', 'text/csv');
    dispatch(uiActions.addToast({ message: 'Plan exported as CSV', type: 'success' }));
  };

  const handleExportJSON = () => {
    const json = exportToJSON(pricing);
    downloadFile(json, 'conference-expense-plan.json', 'application/json');
    dispatch(uiActions.addToast({ message: 'Plan exported as JSON', type: 'success' }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Event Details" size="2xl">
      <div className="space-y-6">
        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Unit Cost
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Quantity
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-300">
                  Total Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pricing.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No items selected yet. Start adding venues, add-ons, or meals!
                  </td>
                </tr>
              ) : (
                pricing.lineItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{item.name}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                      {formatQuantity(item.quantity, item.metadata?.forPeople)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        {pricing.lineItems.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            {pricing.venueSubtotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Venue Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(pricing.venueSubtotal)}
                </span>
              </div>
            )}
            {pricing.addonsSubtotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Add-ons Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(pricing.addonsSubtotal)}
                </span>
              </div>
            )}
            {pricing.mealsSubtotal > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Meals Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(pricing.mealsSubtotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(pricing.subtotal)}
              </span>
            </div>
            {pricing.appliedPromo && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Discount ({pricing.appliedPromo.code})</span>
                <span>-{formatCurrency(pricing.appliedPromo.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300 dark:border-gray-600">
              <span className="text-gray-900 dark:text-gray-100">Grand Total</span>
              <span className="text-blue-600 dark:text-blue-400">
                {formatCurrency(pricing.grandTotal)}
              </span>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {pricing.lineItems.length > 0 && (
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={handleExportCSV} className="flex-1">
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportJSON} className="flex-1">
              Export JSON
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
