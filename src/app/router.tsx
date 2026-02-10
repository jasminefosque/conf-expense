import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { PlannerPage } from '@/pages/PlannerPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LandingPage />,
    },
    {
      path: '/planner',
      element: <PlannerPage />,
    },
  ],
  {
    basename: '/conf-expense',
  }
);
