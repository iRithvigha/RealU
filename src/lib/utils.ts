import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const interests = [
  { id: '1', label: 'Art & Design' },
  { id: '2', label: 'Music' },
  { id: '3', label: 'Gaming' },
  { id: '4', label: 'Technology' },
  { id: '5', label: 'Sports' },
  { id: '6', label: 'Travel' },
  { id: '7', label: 'Food & Cooking' },
  { id: '8', label: 'Reading' },
  { id: '9', label: 'Photography' },
  { id: '10', label: 'Fitness' },
  { id: '11', label: 'Movies & TV' },
  { id: '12', label: 'Nature' },
  { id: '13', label: 'Cryptocurrency' },
  { id: '14', label: 'Web3' },
  { id: '15', label: 'NFTs' },
  { id: '16', label: 'DeFi' },
  { id: '17', label: 'Blockchain' },
  { id: '18', label: 'Programming' },
  { id: '19', label: 'Meditation' },
  { id: '20', label: 'Fashion' },
];