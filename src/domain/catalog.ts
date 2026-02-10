import type { Catalog } from './types';

// Catalog with all items and exact prices from PDF requirements
export const catalog: Catalog = {
  venue: [
    {
      id: 'auditorium-hall',
      name: 'Auditorium Hall',
      capacity: 200,
      unitPrice: 5500,
      imageUrl: '/images/auditorium.jpg',
    },
    {
      id: 'conference-room',
      name: 'Conference Room',
      capacity: 15,
      unitPrice: 3500,
      imageUrl: '/images/conference.jpg',
    },
    {
      id: 'presentation-room',
      name: 'Presentation Room',
      capacity: 50,
      unitPrice: 700,
      imageUrl: '/images/presentation.jpg',
    },
    {
      id: 'large-meeting-room',
      name: 'Large Meeting Room',
      capacity: 10,
      unitPrice: 900,
      imageUrl: '/images/large-meeting.jpg',
    },
    {
      id: 'small-meeting-room',
      name: 'Small Meeting Room',
      capacity: 5,
      unitPrice: 1100,
      imageUrl: '/images/small-meeting.jpg',
    },
  ],
  addons: [
    {
      id: 'speakers',
      name: 'Speakers',
      unitPrice: 35,
      imageUrl: '/images/speakers.jpg',
    },
    {
      id: 'microphones',
      name: 'Microphones',
      unitPrice: 45,
      imageUrl: '/images/microphones.jpg',
    },
    {
      id: 'whiteboards',
      name: 'Whiteboards',
      unitPrice: 80,
      imageUrl: '/images/whiteboards.jpg',
    },
    {
      id: 'projectors',
      name: 'Projectors',
      unitPrice: 200,
      imageUrl: '/images/projectors.jpg',
    },
    {
      id: 'signage',
      name: 'Signage',
      unitPrice: 80,
      imageUrl: '/images/signage.jpg',
    },
  ],
  meals: [
    {
      id: 'breakfast',
      name: 'Breakfast',
      unitPrice: 50,
    },
    {
      id: 'lunch',
      name: 'Lunch',
      unitPrice: 65,
    },
    {
      id: 'high-tea',
      name: 'High Tea',
      unitPrice: 25,
    },
    {
      id: 'dinner',
      name: 'Dinner',
      unitPrice: 70,
    },
  ],
};

export const MEAL_IDS = ['breakfast', 'lunch', 'high-tea', 'dinner'] as const;
export const MIN_PEOPLE = 1;
export const MAX_PEOPLE = 500;
