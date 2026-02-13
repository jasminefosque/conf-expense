import { catalog, MAX_PEOPLE, MIN_PEOPLE } from '@/domain/catalog';
import { formatCurrency } from '@/domain/formatters';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { mealsActions } from './mealsSlice';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import type { MealId } from '@/domain/types';
import { useState } from 'react';

export function MealsSection() {
  const dispatch = useAppDispatch();
  const { people, selected } = useAppSelector((state) => state.meals);
  const [peopleInput, setPeopleInput] = useState(people.toString());
  const [error, setError] = useState('');

  const handlePeopleChange = (value: string) => {
    setPeopleInput(value);
    setError('');

    if (value === '') {
      dispatch(mealsActions.setPeople(0));
      return;
    }

    const num = parseInt(value, 10);

    if (isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    if (num < MIN_PEOPLE) {
      setError(`Minimum ${MIN_PEOPLE} person`);
      dispatch(mealsActions.setPeople(0));
      return;
    }

    if (num > MAX_PEOPLE) {
      setError(`Maximum ${MAX_PEOPLE} people`);
      return;
    }

    dispatch(mealsActions.setPeople(num));
  };

  return (
    <section id="meals" className="scroll-mt-20">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Meals & Catering
      </h2>

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-md">
            <Input
              type="number"
              label="Number of People"
              value={peopleInput}
              onChange={(e) => handlePeopleChange(e.target.value)}
              min={MIN_PEOPLE}
              max={MAX_PEOPLE}
              placeholder={`${MIN_PEOPLE}-${MAX_PEOPLE}`}
              error={error}
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter the number of attendees for meal planning (max {MAX_PEOPLE})
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {catalog.meals.map((item) => {
          const mealId = item.id as MealId;
          const isSelected = selected[mealId];
          const total = isSelected && people > 0 ? item.unitPrice * people : 0;

          return (
            <Card key={item.id} className={isSelected ? 'ring-2 ring-blue-500' : ''}>
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {formatCurrency(item.unitPrice)} per person
                </p>
                <Checkbox
                  label="Select this meal"
                  checked={isSelected}
                  onChange={() => dispatch(mealsActions.toggleMeal(mealId))}
                />
                {total > 0 && (
                  <p className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total: {formatCurrency(total)}
                  </p>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
