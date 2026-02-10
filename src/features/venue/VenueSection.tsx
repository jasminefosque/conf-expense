import { catalog } from '@/domain/catalog';
import { formatCurrency } from '@/domain/formatters';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { venueActions } from './venueSlice';
import { Card, CardBody } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';

export function VenueSection() {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector((state) => state.venue.quantities);

  return (
    <section id="venue" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Venue Rooms
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalog.venue.map((item) => {
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>
                <div className="space-y-1 mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Capacity: {item.capacity} people
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Stepper
                    value={quantity}
                    onIncrement={() => dispatch(venueActions.increment(item.id))}
                    onDecrement={() => dispatch(venueActions.decrement(item.id))}
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
