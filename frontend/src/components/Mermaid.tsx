'use client';

import dynamic from 'next/dynamic';

const MermaidComponent = dynamic(
  () => import('./MermaidComponent'),
  { ssr: false }
);

interface MermaidProps {
  chart: string;
}

export default function Mermaid({ chart }: MermaidProps) {
  return <MermaidComponent chart={chart} />;
}
