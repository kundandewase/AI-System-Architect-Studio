'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeftRight,
  Gauge,
  Layers,
  PencilLine,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from 'lucide-react';
import Mermaid from './Mermaid';

interface Column {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeign: boolean;
  notes?: string;
}

interface Table {
  tableName: string;
  columns: Column[];
  relationships?: string[];
}

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | string;
  path: string;
  description: string;
  requestBody?: string | null;
  responseBody: string;
}

interface TechDetail {
  technologies: string[];
  reason: string;
}

interface TechStack {
  frontend: TechDetail;
  backend: TechDetail;
  database: TechDetail;
  other: TechDetail;
}

interface DeploymentPlatform {
  platform: string;
  purpose: string;
  cost: string;
  details: string;
}

interface CostTier {
  users: string;
  monthlyCost: string;
  breakdown: string[];
  recommendation: string;
}

interface CostEstimation {
  small: CostTier;
  medium: CostTier;
  large: CostTier;
}

interface ArchitectureBlueprint {
  systemArchitecture: string;
  databaseSchema: Table[];
  apiEndpoints: APIEndpoint[];
  techStack: TechStack;
  deployment: DeploymentPlatform[];
  costEstimation: CostEstimation;
}

interface ArchitectureStudioProps {
  blueprint: ArchitectureBlueprint;
  idea: string;
}

type Scenario = {
  users: number;
  trafficMultiplier: number;
  cacheHitRate: number;
  dbLatency: number;
  workers: number;
};

type ComparisonResult = {
  label: string;
  fit: number;
  rationale: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function scoreBlueprint(blueprint: ArchitectureBlueprint) {
  const completeness = clamp(30 + blueprint.databaseSchema.length * 6 + blueprint.apiEndpoints.length * 4, 0, 100);
  const maintainability = clamp(70 + blueprint.techStack.backend.technologies.length * 4 - blueprint.databaseSchema.length, 0, 100);
  const scalability = clamp(45 + blueprint.deployment.length * 8 + blueprint.apiEndpoints.length * 2, 0, 100);
  const reliability = clamp(55 + blueprint.costEstimation.medium.breakdown.length * 4, 0, 100);

  return {
    completeness,
    maintainability,
    scalability,
    reliability,
    overall: clamp(Math.round((completeness + maintainability + scalability + reliability) / 4), 0, 100),
  };
}

function getComparisonRows(idea: string, blueprint: ArchitectureBlueprint): ComparisonResult[] {
  const ideaSize = idea.trim().split(/\s+/).filter(Boolean).length;
  const modularFit = clamp(92 - Math.abs(ideaSize - 40), 0, 100);

  return [
    {
      label: 'Monolith',
      fit: clamp(88 - ideaSize, 0, 100),
      rationale: 'Fastest path for small teams and short validation cycles.',
    },
    {
      label: 'Modular Monolith',
      fit: modularFit,
      rationale: 'Best balance of speed, clarity, and future extraction potential.',
    },
    {
      label: 'Microservices',
      fit: clamp(ideaSize * 2 + blueprint.apiEndpoints.length * 4, 0, 100),
      rationale: 'Useful when scale and team boundaries justify the operational cost.',
    },
    {
      label: 'Serverless Hybrid',
      fit: clamp(50 + blueprint.deployment.length * 6, 0, 100),
      rationale: 'Good for bursty workflows and managed infrastructure preferences.',
    },
  ];
}

function metricLabel(value: number) {
  if (value >= 80) return 'Strong';
  if (value >= 60) return 'Healthy';
  if (value >= 40) return 'Watch';
  return 'Weak';
}

export default function ArchitectureStudio({ blueprint, idea }: ArchitectureStudioProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'planner' | 'compare' | 'score' | 'simulator'>('editor');
  const [diagramDraft, setDiagramDraft] = useState(blueprint.systemArchitecture);
  const [comparisonIdea, setComparisonIdea] = useState('');
  const [scenario, setScenario] = useState<Scenario>({
    users: 2500,
    trafficMultiplier: 1.5,
    cacheHitRate: 62,
    dbLatency: 35,
    workers: 3,
  });

  const score = useMemo(() => scoreBlueprint(blueprint), [blueprint]);
  const comparisonRows = useMemo(() => getComparisonRows(idea, blueprint), [blueprint, idea]);

  const comparisonSummary = useMemo(() => {
    const rows = comparisonRows.slice().sort((a, b) => b.fit - a.fit);
    return rows[0];
  }, [comparisonRows]);

  const simulator = useMemo(() => {
    const projectedUsers = Math.round(scenario.users * Math.pow(1.2, 6));
    const load = Math.round((scenario.users * scenario.trafficMultiplier * (1 - scenario.cacheHitRate / 120)) / Math.max(1, scenario.workers));
    const latency = Math.round((scenario.dbLatency + load / 55) * (1 + scenario.trafficMultiplier / 5));
    const headroom = Math.round((scenario.workers * 1200) - load);

    return {
      projectedUsers,
      load,
      latency,
      headroom,
      status: latency < 120 && headroom > 0 ? 'Stable' : latency < 220 ? 'Under Pressure' : 'Critical',
      actions: [
        scenario.cacheHitRate < 65 ? 'Add read-through caching and CDN edge caching.' : 'Cache coverage is adequate for now.',
        scenario.dbLatency > 45 ? 'Review indexes and query paths before scaling nodes.' : 'Database latency is within a healthy range.',
        scenario.workers < 4 ? 'Add at least one more application node for headroom.' : 'Worker pool is reasonable for the current load.',
      ],
    };
  }, [scenario]);

  return (
    <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5 border-b border-zinc-800/50 pb-4">
        <div>
          <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Architecture Studio
          </h4>
          <p className="text-sm text-zinc-400 mt-1">Edit diagrams, plan for scale, compare styles, score the design, and run traffic simulations.</p>
        </div>
        <span className="text-xs text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
          Architecture score: {score.overall}/100
        </span>
      </div>

      <div className="flex items-center bg-zinc-950 border border-zinc-900 p-1 rounded-xl overflow-x-auto max-w-full mb-6">
        {[
          { id: 'editor', label: 'Interactive Diagram Editor', icon: PencilLine },
          { id: 'planner', label: 'Scalability Planner', icon: SlidersHorizontal },
          { id: 'compare', label: 'Architecture Comparison', icon: ArrowLeftRight },
          { id: 'score', label: 'Architecture Score', icon: Gauge },
          { id: 'simulator', label: 'System Design Simulator', icon: PlayCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`text-xs px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h5 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <PencilLine className="w-4 h-4 text-violet-400" />
                  Live Mermaid Editor
                </h5>
                <p className="text-xs text-zinc-500 mt-1">Change the chart source and immediately preview the result.</p>
              </div>
              <button
                onClick={() => setDiagramDraft(blueprint.systemArchitecture)}
                className="text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 flex items-center gap-2 hover:border-violet-500/40 hover:text-zinc-100 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
            <textarea
              value={diagramDraft}
              onChange={(event) => setDiagramDraft(event.target.value)}
              className="w-full h-96 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 text-xs font-mono p-4 leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              spellCheck={false}
            />
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Preview</span>
            </div>
            <Mermaid chart={diagramDraft} />
          </div>
        </div>
      )}

      {activeTab === 'planner' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              ['Expected users', scenario.users, 500, 500000, 500],
              ['Traffic multiplier', Math.round(scenario.trafficMultiplier * 10), 10, 80, 1],
              ['Cache hit rate', scenario.cacheHitRate, 0, 95, 1],
            ].map(([label, value, min, max, step]) => (
              <label key={String(label)} className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-zinc-200">{label}</span>
                  <span className="text-sm font-mono text-violet-300">{label === 'Traffic multiplier' ? `${Number(value) / 10}x` : value}</span>
                </div>
                <input
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    if (label === 'Expected users') setScenario((current) => ({ ...current, users: nextValue }));
                    if (label === 'Traffic multiplier') setScenario((current) => ({ ...current, trafficMultiplier: nextValue / 10 }));
                    if (label === 'Cache hit rate') setScenario((current) => ({ ...current, cacheHitRate: nextValue }));
                  }}
                  className="w-full accent-violet-500"
                />
              </label>
            ))}
            <label className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200">Database latency</span>
                <span className="text-sm font-mono text-violet-300">{scenario.dbLatency} ms</span>
              </div>
              <input type="range" min={5} max={120} step={1} value={scenario.dbLatency} onChange={(event) => setScenario((current) => ({ ...current, dbLatency: Number(event.target.value) }))} className="w-full accent-violet-500" />
            </label>
            <label className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200">Worker nodes</span>
                <span className="text-sm font-mono text-violet-300">{scenario.workers}</span>
              </div>
              <input type="range" min={1} max={12} step={1} value={scenario.workers} onChange={(event) => setScenario((current) => ({ ...current, workers: Number(event.target.value) }))} className="w-full accent-violet-500" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Projected users</p>
              <p className="text-2xl font-bold text-zinc-100">{simulator.projectedUsers.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Load</p>
              <p className="text-2xl font-bold text-zinc-100">{simulator.load.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Estimated latency</p>
              <p className="text-2xl font-bold text-zinc-100">{simulator.latency} ms</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Headroom</p>
              <p className="text-2xl font-bold text-zinc-100">{simulator.headroom}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-4">
          <textarea
            value={comparisonIdea}
            onChange={(event) => setComparisonIdea(event.target.value)}
            className="w-full min-h-[140px] rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
            placeholder="Describe the alternate architecture you want to compare"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {comparisonRows.map((row) => (
              <div key={row.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h5 className="text-sm font-bold text-zinc-100">{row.label}</h5>
                  <span className="text-xs font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-md">{row.fit}/100</span>
                </div>
                <p className="text-sm text-zinc-400">{row.rationale}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Best fit</p>
            <p className="text-lg font-semibold text-zinc-100">{comparisonSummary.label}</p>
          </div>
        </div>
      )}

      {activeTab === 'score' && (
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-full border border-violet-500/20 bg-violet-500/5 flex items-center justify-center mb-4">
              <div>
                <p className="text-5xl font-extrabold text-zinc-100">{score.overall}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Overall</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400">{metricLabel(score.overall)} architecture confidence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Completeness', value: score.completeness, icon: Workflow },
              { label: 'Maintainability', value: score.maintainability, icon: ShieldCheck },
              { label: 'Scalability', value: score.scalability, icon: Layers },
              { label: 'Reliability', value: score.reliability, icon: Activity },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <metric.icon className="w-4 h-4 text-violet-400" />
                    <p className="text-sm font-semibold text-zinc-200">{metric.label}</p>
                  </div>
                  <span className="text-sm font-mono text-zinc-300">{metric.value}/100</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: 'Traffic multiplier', value: scenario.trafficMultiplier, min: 1, max: 6, step: 0.1, update: (value: number) => setScenario((current) => ({ ...current, trafficMultiplier: value })) },
              { label: 'Cache hit rate', value: scenario.cacheHitRate, min: 0, max: 95, step: 1, update: (value: number) => setScenario((current) => ({ ...current, cacheHitRate: value })) },
            ].map((field) => (
              <label key={field.label} className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-zinc-200">{field.label}</span>
                  <span className="text-sm font-mono text-violet-300">{field.label === 'Traffic multiplier' ? `${field.value.toFixed(1)}x` : `${field.value}%`}</span>
                </div>
                <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={(event) => field.update(Number(event.target.value))} className="w-full accent-violet-500" />
              </label>
            ))}
            <label className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200">Database latency</span>
                <span className="text-sm font-mono text-violet-300">{scenario.dbLatency} ms</span>
              </div>
              <input type="range" min={5} max={120} step={1} value={scenario.dbLatency} onChange={(event) => setScenario((current) => ({ ...current, dbLatency: Number(event.target.value) }))} className="w-full accent-violet-500" />
            </label>
            <label className="block rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-zinc-200">Worker nodes</span>
                <span className="text-sm font-mono text-violet-300">{scenario.workers}</span>
              </div>
              <input type="range" min={1} max={12} step={1} value={scenario.workers} onChange={(event) => setScenario((current) => ({ ...current, workers: Number(event.target.value) }))} className="w-full accent-violet-500" />
            </label>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Status</p>
              <p className="text-2xl font-bold text-zinc-100">{simulator.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Forecast users</p>
              <p className="text-xl font-semibold text-zinc-100">{simulator.projectedUsers.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Estimated latency</p>
              <p className="text-xl font-semibold text-zinc-100">{simulator.latency} ms</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-1">Capacity headroom</p>
              <p className="text-xl font-semibold text-zinc-100">{simulator.headroom}</p>
            </div>
            <div className="pt-3 border-t border-zinc-800">
              <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">Suggested actions</p>
              <ul className="space-y-2 text-sm text-zinc-400">
                {simulator.actions.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-violet-400 flex-shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}