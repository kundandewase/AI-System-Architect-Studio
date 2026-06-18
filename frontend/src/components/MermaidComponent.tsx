'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface MermaidComponentProps {
  chart: string;
}

function cleanMermaidSyntax(chart: string): string {
  let clean = chart.trim();

  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:mermaid)?\s*/i, '').replace(/\s*```$/, '');
  }

  clean = clean.replace(/\r\n?/g, '\n');
  clean = clean.replace(/^flowChart\b/i, 'flowchart');

  const headerMatch = clean.match(/^(graph|flowchart)\s+(\w+)\s+/i);
  if (headerMatch) {
    clean = clean.replace(/^(graph|flowchart)\s+(\w+)\s+/i, `${headerMatch[1]} ${headerMatch[2]}\n`);
  }

  clean = clean.replace(
    /\b([A-Za-z_][\w-]*)\s*(-->|---|==>|-\.->|--|==|-\.\-?)\s*([A-Za-z_][\w-]*(?:\[[^\n\r\]]*\]|\([^\n\r\)]*\)|\{[^\n\r\}]*\}))\s*:\s*"([^"]+)"/g,
    (_match, sourceNode, connector, targetNode, label) => `${sourceNode} ${connector}|${label}| ${targetNode}`
  );

  let inQuotes = false;
  let normalized = '';
  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    if (char === '"') {
      inQuotes = !inQuotes;
      normalized += char;
      continue;
    }

    if (inQuotes && char === '\n') {
      normalized += ' ';
      continue;
    }

    normalized += char;
  }

  clean = normalized.replace(/"([^"]*)"/g, (_match, labelText) => {
    const normalizedLabel = String(labelText).replace(/\s{2,}/g, ' ').trim();
    return `"${normalizedLabel}"`;
  });

  clean = clean.replace(/([\]\)\}])\s+(?=[A-Za-z_][\w-]*\s*(?:-->|---|==>|-\.->|--|==|-\.\-?|\[[^\n\r]*\]|\([^\n\r]*\)|\{[^\n\r]*\}))/g, '$1\n');
  clean = clean.replace(/\b([A-Za-z_][\w-]*)\s+(?=[A-Za-z_][\w-]*\s*(?:\[[^\n\r]*\]|\([^\n\r]*\)|\{[^\n\r]*\}))/g, '$1\n');

  clean = clean.replace(/\n{3,}/g, '\n\n');

  return clean;
}

export default function MermaidComponent({ chart }: MermaidComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [renderState, setRenderState] = useState<{ chart: string; svg: string; error: string | null }>({
    chart: '',
    svg: '',
    error: null,
  });

  useEffect(() => {
    if (!chart) return;

    const id = `mermaid-${Math.floor(Math.random() * 1000000)}`;
    let cancelled = false;

    const cleanChart = cleanMermaidSyntax(chart);

    mermaid.render(id, cleanChart)
      .then(({ svg }) => {
        if (!cancelled) {
          setRenderState({ chart: cleanChart, svg, error: null });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Mermaid render promise rejection:', err);
        setRenderState({ chart: cleanChart, svg: '', error: 'Could not render architecture diagram. Check Mermaid syntax.' });

        // Clear broken elements if any were injected into body by mermaid
        const element = document.getElementById(id);
        if (element) {
          element.remove();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (renderState.error) {
    return (
      <div className="text-sm text-rose-400 bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl">
        <p className="font-semibold mb-1">Diagram Render Failed</p>
        <p className="text-zinc-400 text-xs mb-2">The AI generated a diagram that couldn&apos;t be parsed by Mermaid.js.</p>
        <pre className="text-xs bg-black/40 p-3 rounded overflow-x-auto text-zinc-300 max-h-48 font-mono">
          {chart}
        </pre>
      </div>
    );
  }

  if (renderState.chart !== cleanMermaidSyntax(chart)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-zinc-950/40 rounded-xl border border-zinc-800/50">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm text-zinc-400">Rendering flow diagram...</span>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-svg-container overflow-x-auto p-6 bg-zinc-950/40 rounded-xl border border-zinc-800/50 flex justify-center items-center" 
      ref={ref} 
      dangerouslySetInnerHTML={{ __html: renderState.svg }} 
    />
  );
}
