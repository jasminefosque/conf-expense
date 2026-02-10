import { catalog } from '@/domain/catalog';
import { formatCurrency } from '@/domain/formatters';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addonsActions } from './addonsSlice';
import { Card, CardBody } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';

export function AddonsSection() {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector((state) => state.addons.quantities);

  return (
    <section id="addons" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Add-ons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.addons.map((item) => {
          const quantity = quantities[item.id] ?? 0;

          return (
            <Card key={item.id}>
              <CardBody>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-4">
                  {formatCurrency(item.unitPrice)}
                </p>
                <div className="flex items-center justify-between">
                  <Stepper
                    value={quantity}
                    onIncrement={() => dispatch(addonsActions.increment(item.id))}
                    onDecrement={() => dispatch(addonsActions.decrement(item.id))}
                    label={item.name}
                  />
                  {quantity > 0 && (
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total: {formatCurrency(item.unitPrice * quantity)}
                    </span>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
