import { Header } from '@/components/layout/Header';
import { VenueSection } from '@/features/venue/VenueSection';
import { AddonsSection } from '@/features/addons/AddonsSection';
import { MealsSection } from '@/features/meals/MealsSection';
import { PromoSection } from '@/features/promo/PromoSection';
import { SummaryCard } from '@/features/summary/SummaryCard';
import { DetailsModal } from '@/features/summary/DetailsModal';

export function PlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <VenueSection />
            <AddonsSection />
            <MealsSection />
            <PromoSection />
          </div>

          {/* Sidebar - Summary */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <SummaryCard />
          </aside>
        </div>
      </main>

      {/* Details Modal */}
      <DetailsModal />
    </div>
  );
}
