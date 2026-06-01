import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}): Promise<Metadata> {
  const { sessionId } = await params;
  return {
    title: 'Tell them how you see them: How People See Me',
    description:
      'Tap one card to tell your friend what they bring into the world. Takes less than 3 seconds. Completely anonymous.',
    openGraph: {
      title: 'How does this person make you feel?',
      description: 'Tap one card, it takes only 3 seconds. Completely anonymous.',
      type: 'website',
    },
  };
}

export { default } from './VotingPage';
