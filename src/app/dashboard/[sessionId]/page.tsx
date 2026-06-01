import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'My Results: How People See Me',
    description: 'See how your friends appreciate you. Live results from your appreciation page.',
  };
}

export { default } from './DashboardPage';
