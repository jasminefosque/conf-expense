# Conference Expense Command Center

A production-grade React TypeScript application for planning conference expenses with real-time cost calculations, promotional discounts, and export capabilities.

🔗 **[Live Demo](https://jasminefosque.github.io/conf-expense/)**

## Features

### 🏢 Venue Management
- **5 Room Types**: Auditorium Hall, Conference Room, Presentation Room, Large Meeting Room, Small Meeting Room
- Each with specific capacity and pricing
- Real-time quantity management with accessible stepper controls

### 🎤 Add-ons Selection
- **5 Equipment Types**: Speakers, Microphones, Whiteboards, Projectors, Signage
- Individual unit pricing
- Flexible quantity controls

### 🍽️ Catering & Meals
- **4 Meal Options**: Breakfast, Lunch, High Tea, Dinner
- Per-person pricing (1-500 attendees)
- Checkbox selection for meal types
- Dynamic total calculation

### 💰 Promotional Discounts
- **EARLYBIRD10**: 10% off venue bookings
- **AVBUNDLE5**: 5% off add-ons (minimum $500 subtotal)
- **CATER15**: 15% off meals (minimum 50 people)
- Smart validation with clear error messages

### 📊 Advanced Features
- **Live Summary**: Real-time item count and total cost
- **Details Modal**: 4-column table (Name, Unit Cost, Quantity, Total)
- **Export Options**: Download as CSV or JSON
- **Persistence**: Automatic save to localStorage
- **Toast Notifications**: User-friendly feedback
- **Responsive Design**: Mobile, tablet, and desktop optimized

## Tech Stack

### Core
- **Vite** - Fast build tool and dev server
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling

### State & Routing
- **Redux Toolkit** - Global state management
- **React Router** - Client-side routing
- **React Hook Form** - Form state (ready for expansion)
- **Zod** - Schema validation (ready for expansion)

### Testing
- **Vitest** - Unit and component tests
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing

### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Maximum type safety

### CI/CD
- **GitHub Actions** - Automated testing and deployment
- **GitHub Pages** - Static site hosting

## Architecture

### Project Structure

```
src/
├── app/                    # Redux store, hooks, selectors, router
│   ├── store.ts           # Store configuration with persistence
│   ├── hooks.ts           # Typed Redux hooks
│   ├── selectors.ts       # Memoized selectors
│   ├── router.tsx         # React Router configuration
│   └── uiSlice.ts         # UI state (modals, toasts)
├── domain/                 # Framework-independent business logic
│   ├── types.ts           # Core TypeScript types
│   ├── catalog.ts         # Item catalog with prices
│   ├── pricingEngine.ts   # Pure pricing calculations
│   ├── promoCodes.ts      # Promo validation and rules
│   ├── formatters.ts      # Currency and number formatting
│   └── exportUtils.ts     # CSV/JSON export logic
├── features/               # Feature-based modules
│   ├── venue/             # Venue room selection
│   ├── addons/            # Add-ons selection
│   ├── meals/             # Meals configuration
│   ├── promo/             # Promo code application
│   └── summary/           # Summary card and details modal
├── components/             # Shared UI components
│   ├── ui/                # Base components (Button, Card, Modal, etc.)
│   └── layout/            # Layout components (Header)
├── pages/                  # Page components
│   ├── LandingPage.tsx    # Marketing landing page
│   └── PlannerPage.tsx    # Main planner interface
└── test/                   # Test configuration
    └── setup.ts           # Vitest setup
```

### Key Design Decisions

#### Domain Layer
The `domain/` folder contains **framework-independent** business logic:
- Pure TypeScript functions
- No React dependencies
- Fully unit tested
- Can be reused in other contexts (Node.js, React Native, etc.)

#### Pricing Engine
Single source of truth for all calculations:
```typescript
calculatePricing(state: PlanState): PricingResult
```
- Calculates subtotals for each category
- Applies promotional discounts
- Returns line items for detailed breakdown
- Pure function - no side effects

#### State Management
Redux slices organized by feature:
- `venue`: Room quantity selections
- `addons`: Equipment quantity selections  
- `meals`: People count + selected meals
- `promo`: Applied promotional code
- `ui`: Modal open/closed, toast queue

#### Persistence
Automatic localStorage sync:
- Saves on every state change
- Loads on app initialization
- Versioned storage key
- Excludes UI-only state

## Installation & Development

### Prerequisites
- Node.js 20+ 
- npm 10+

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Opens at `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Output in `dist/` directory

### Type Checking
```bash
npm run typecheck
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
```

### Testing

#### Unit Tests
```bash
npm test
```

#### Unit Tests with Coverage
```bash
npm run test:coverage
```

#### E2E Tests
```bash
npm run e2e
```

#### E2E Tests UI Mode
```bash
npm run e2e:ui
```

## Testing Strategy

### Unit Tests (Vitest)
- **Pricing Engine**: 15 tests covering all calculation scenarios
- **Promo Codes**: 15 tests for validation and conditions
- Coverage: Core business logic

### Component Tests
- Ready for expansion with React Testing Library
- Setup configured in `src/test/setup.ts`

### E2E Tests (Playwright)
- Full user journey: Landing → Planner → Add items → Apply promo → Export
- Promo code validation flows
- Modal interactions and keyboard navigation

## Deployment

### GitHub Pages

The application is configured for GitHub Pages deployment:

1. **Base Path**: Set in `vite.config.ts` to `/conf-expense/`
2. **Router**: Uses `basename` prop for correct routing
3. **CI/CD**: Automated deployment via GitHub Actions

### Manual Deployment

```bash
npm run build
# Deploy dist/ folder to your static host
```

## Accessibility

- ✅ Semantic HTML elements
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus trap in modals
- ✅ Descriptive button labels
- ✅ Color contrast compliance
- ✅ Screen reader friendly

## Performance

- ✅ Memoized selectors (Redux Toolkit)
- ✅ Code splitting by route
- ✅ Optimized React rendering
- ✅ Tailwind CSS purging
- ✅ Vite's fast HMR

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

MIT License - See [LICENSE](LICENSE) file for details

## Security

See [SECURITY.md](SECURITY.md) for security policy and data handling information.

## Contributing

This is a demonstration project. Feel free to fork and modify for your own learning!

## Screenshots

### Landing Page
Clean, modern landing page with feature highlights and call-to-action.

### Planner Interface
Comprehensive planning interface with three sections (Venue, Add-ons, Meals) and live summary sidebar.

### Details Modal
Detailed line-item breakdown with export options.

---

**Built with ❤️ using modern React and TypeScript practices**
