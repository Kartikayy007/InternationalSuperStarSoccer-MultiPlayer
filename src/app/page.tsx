'use client'

import dynamic from 'next/dynamic';

// Dynamically import the Game component with no SSR since it uses canvas
const Game = dynamic(() => import('@/components/Game'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <Game />
    </main>
  );
}
