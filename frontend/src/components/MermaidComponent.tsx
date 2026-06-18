'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
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

  // Auto-inject semicolon between two separate connections on the same line (e.g. A --> B C --> D)
  const connRegex = /([\]\)}"]|\b\w+)\s+(\b\w+)\s*(-+>|={2,}>|-{2,}|={2,})/g;
  clean = clean.replace(connRegex, '$1; $2 $3');

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
      <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 p-4 rounded-xl">
        <p className="font-semibold mb-1">Diagram Render Failed</p>
        <p className="text-slate-500 text-xs mb-2">The AI generated a diagram that couldn&apos;t be parsed by Mermaid.js.</p>
        <pre className="text-xs bg-slate-100 p-3 rounded overflow-x-auto text-slate-700 border border-slate-200 max-h-48 font-mono">
          {chart}
        </pre>
      </div>
    );
  }

  if (renderState.chart !== cleanMermaidSyntax(chart)) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200/80 shadow-sm">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm text-slate-400">Rendering flow diagram...</span>
      </div>
    );
  }

  return (
    <div 
      className="mermaid-svg-container overflow-x-auto p-6 bg-white rounded-xl border border-slate-200 shadow-sm flex justify-center items-center" 
      ref={ref} 
      dangerouslySetInnerHTML={{ __html: renderState.svg }} 
    />
  );
}
