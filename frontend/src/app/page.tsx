'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Database, 
  Terminal, 
  Cpu, 
  Globe, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Server,
  Key
} from 'lucide-react';
import Mermaid from '../components/Mermaid';
import Loader from '../components/Loader';
import ArchitectureStudio from '../components/ArchitectureStudio';

// TypeScript Interfaces for Structured Response
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

type ReportTab = 'all' | 'architecture' | 'database' | 'api' | 'tech' | 'deployment' | 'cost';

const PRESETS = [
  "Food delivery app like Swiggy with real-time tracking and payments",
  "SaaS Project Management Tool like Trello with Kanban boards and invites",
  "E-commerce platform like Shopify with multi-vendor support and checkout"
];

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number; // ms, default 3000
}

function LoadingScreen({ onComplete, duration = 3000 }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out 500ms before unmounting
    const fadeTimer = setTimeout(() => setFadeOut(true), duration - 500);
    const doneTimer = setTimeout(() => onComplete(), duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Corner brackets */}
      {[
        { top: 24, left: 24, borderWidth: '1px 0 0 1px' },
        { top: 24, right: 24, borderWidth: '1px 1px 0 0' },
        { bottom: 24, left: 24, borderWidth: '0 0 1px 1px' },
        { bottom: 24, right: 24, borderWidth: '0 1px 1px 0' },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 24,
          height: 24,
          borderColor: 'rgba(99,102,241,0.2)',
          borderStyle: 'solid',
          ...pos,
        }} />
      ))}

      {/* Logo + rings */}
      <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
        {/* Pulse */}
        <div style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(99,102,241,0.08)',
          animation: 'as-pulse 2s ease-in-out infinite',
        }} />
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderTopColor: '#6366f1',
          borderRightColor: '#6366f1',
          animation: 'as-spin 1.6s linear infinite',
        }} />
        {/* Inner ring */}
        <div style={{
          position: 'absolute',
          width: 72,
          height: 72,
          borderRadius: '50%',
          border: '2px solid transparent',
          borderBottomColor: '#a78bfa',
          borderLeftColor: '#a78bfa',
          animation: 'as-spin-r 1.2s linear infinite',
        }} />
        {/* Icon box */}
        <div style={{
          width: 44,
          height: 44,
          background: '#ffffff',
          borderRadius: 12,
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 4px 12px rgba(99,102,241,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M17.5 14v7M14 17.5h7" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 22,
        fontWeight: 600,
        color: '#0f172a',
        letterSpacing: '-0.3px',
        marginBottom: 6,
        animation: 'as-fade-up 0.6s ease 0.2s both',
        textAlign: 'center',
      }}>
        AI System Architect
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 12,
        color: '#64748b',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 40,
        animation: 'as-fade-up 0.6s ease 0.4s both',
      }}>
        Studio
      </div>

      {/* Progress bar */}
      <div style={{
        width: 200,
        height: 3,
        background: 'rgba(99,102,241,0.1)',
        borderRadius: 99,
        overflow: 'hidden',
        marginBottom: 16,
        animation: 'as-fade-up 0.6s ease 0.6s both',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
          borderRadius: 99,
          animation: `as-progress ${duration - 600}ms cubic-bezier(0.4,0,0.2,1) 0.8s both`,
        }} />
      </div>

      {/* Status dots */}
      <div style={{
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        animation: 'as-fade-up 0.6s ease 0.8s both',
      }}>
        Initializing
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'as-dot 1.2s ease-in-out 0s infinite' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'as-dot 1.2s ease-in-out 0.2s infinite' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'as-dot 1.2s ease-in-out 0.4s infinite' }} />
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes as-spin    { to { transform: rotate(360deg); } }
        @keyframes as-spin-r  { to { transform: rotate(-360deg); } }
        @keyframes as-pulse   { 0%,100% { transform: scale(0.8); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 0.3; } }
        @keyframes as-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes as-progress { from { width: 0%; } to { width: 100%; } }
        @keyframes as-dot     { 0%,80%,100% { opacity: 0.2; } 40% { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [idea, setIdea] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [blueprint, setBlueprint] = useState<ArchitectureBlueprint | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTab>('all');

  const handleGenerate = async (selectedIdea?: string) => {
    const targetIdea = selectedIdea || idea;
    if (!targetIdea.trim()) return;

    setStatus('loading');
    setError(null);
    setBlueprint(null);

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: targetIdea }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate system architecture.');
      }

      setBlueprint(data);
      setStatus('success');
    } catch (error: unknown) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please check if the backend is running.');
      setStatus('error');
    }
  };

  const selectPreset = (preset: string) => {
    setIdea(preset);
    handleGenerate(preset);
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'POST': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'PUT': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'DELETE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <>
      {showLoadingScreen && (
        <LoadingScreen onComplete={() => setShowLoadingScreen(false)} />
      )}
      <main className="flex-1 flex flex-col bg-white text-slate-900 selection:bg-violet-500/10 relative overflow-hidden">
        
        {/* Wavy Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
          <div className="absolute top-0 left-0 right-0 h-[800px] bg-gradient-to-b from-violet-50/40 via-white to-transparent pointer-events-none" />
          
          {/* Animated wave 1 (Slowest / Back) */}
          <div className="absolute w-[200%] h-[350px] -left-1/4 -top-[100px] opacity-25 animate-wave-slow">
            <svg className="w-full h-full" viewBox="0 0 1440 350" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,180 C360,280 720,80 1080,260 C1440,440 1800,80 2160,260 C2520,440 2880,180 2880,180 L2880,350 L0,350 Z" fill="url(#wave-grad-1)"/>
              <defs>
                <linearGradient id="wave-grad-1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c7d2fe" />
                  <stop offset="100%" stopColor="#e0e7ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated wave 2 (Medium / Middle) */}
          <div className="absolute w-[200%] h-[300px] -left-1/2 -top-[50px] opacity-20 animate-wave-medium">
            <svg className="w-full h-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,120 C360,220 720,20 1080,220 C1440,420 1800,20 2160,220 C2520,420 2880,120 2880,120 L2880,300 L0,300 Z" fill="url(#wave-grad-2)"/>
              <defs>
                <linearGradient id="wave-grad-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ddd6fe" />
                  <stop offset="100%" stopColor="#f3e8ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Animated wave 3 (Fastest / Front) */}
          <div className="absolute w-[200%] h-[260px] -left-1/3 -top-[20px] opacity-15 animate-wave-fast">
            <svg className="w-full h-full" viewBox="0 0 1440 260" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,90 C360,190 720,10 1080,170 C1440,330 1800,10 2160,170 C2520,330 2880,90 2880,90 L2880,260 L0,260 Z" fill="url(#wave-grad-3)"/>
              <defs>
                <linearGradient id="wave-grad-3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c5e2f6" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />
        </div>

        {/* App Header */}
        <header className="relative border-b border-slate-200/80 bg-white/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                AI System Architect
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gemini 2.5 Blueprint Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">Engine: Online</span>
          </div>
        </header>

        {/* Main Workspace Grid */}
        <div className="relative flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 z-10">
          
          {/* Input Panel */}
          {status === 'idle' && (
            <section className="bg-white/70 border border-slate-200/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Describe Your App Idea
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Enter your application concept in plain English. The AI architect will parse it and generate standard database schemas, API routes, topology diagrams, and infrastructure cost estimations.
              </p>

              <div className="relative">
                <textarea
                  className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 resize-none transition-all duration-300"
                  placeholder="e.g., I want to build a real-time chat application with group channels, file sharing, and message delivery statuses..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 flex items-center">
                  <button
                    onClick={() => handleGenerate()}
                    disabled={!idea.trim()}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm flex items-center gap-2 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                  >
                    Generate
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Or try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => selectPreset(preset)}
                      className="text-xs text-left px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-200 hover:border-violet-500/30 hover:bg-white text-slate-600 hover:text-slate-900 transition-all duration-200 active:scale-[0.98] shadow-sm"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Loading State */}
          {status === 'loading' && (
            <div className="bg-white/70 border border-slate-200/80 rounded-2xl p-8 backdrop-blur-md shadow-md flex items-center justify-center">
              <Loader />
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 backdrop-blur-sm flex items-start gap-4 shadow-sm">
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-rose-600 mb-1">Architecture Pipeline Interrupted</h3>
                <p className="text-sm text-slate-600 mb-4">{error}</p>
                <div className="bg-white/70 border border-slate-200 p-4 rounded-xl max-w-xl shadow-inner">
                  <p className="text-xs font-semibold text-slate-700 mb-1">Troubleshooting Tips:</p>
                  <ul className="text-xs text-slate-500 list-disc list-inside space-y-1">
                    <li>Ensure your `GEMINI_API_KEY` is added to the `.env` file in the backend directory.</li>
                    <li>Verify the Express backend is running on `http://localhost:3001` (run `npm run dev` in backend).</li>
                    <li>Check terminal outputs in the backend for specific Gemini API quota limits or network errors.</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setStatus('idle')} 
                  className="mt-6 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 active:scale-[0.98] shadow-sm"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  Go Back to Search
                </button>
              </div>
            </div>
          )}

          {/* Success / Result State */}
          {status === 'success' && blueprint && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              {/* Report Header Tab Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-lg">Generated Architecture Report</h3>
                  </div>
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setBlueprint(null);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center gap-1.5 active:scale-[0.98] shadow-sm"
                  >
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                    New Search
                  </button>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl overflow-x-auto max-w-full shadow-inner">
                  {[
                    { id: 'all', label: 'Full Blueprint' },
                    { id: 'architecture', label: '1. Topology' },
                    { id: 'database', label: '2. Database' },
                    { id: 'api', label: '3. REST APIs' },
                    { id: 'tech', label: '4. Tech Stack' },
                    { id: 'deployment', label: '5. Deployment' },
                    { id: 'cost', label: '6. Cost' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as ReportTab)}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Blueprint Contents */}
              <div className="space-y-10">
                
                {/* SECTION 1: SYSTEM ARCHITECTURE DIAGRAM */}
                {(activeTab === 'all' || activeTab === 'architecture') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <Layers className="w-5 h-5 text-violet-500" />
                        Section 1: System Architecture Diagram
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Mermaid.js Flowchart</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      A visual flowchart of client-server components, api boundaries, databases, and third-party gateways.
                    </p>
                    <Mermaid chart={blueprint.systemArchitecture} />
                  </div>
                )}

                {/* SECTION 2: DATABASE SCHEMA */}
                {(activeTab === 'all' || activeTab === 'database') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <Database className="w-5 h-5 text-violet-500" />
                        Section 2: Database Schema
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Relational Database</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      Structured tables, columns, primary/foreign keys, and data relationships to model your business requirements.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {blueprint.databaseSchema.map((table, tIdx) => (
                        <div key={tIdx} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
                          {/* Table Name */}
                          <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-3 flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800 text-sm">{table.tableName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">TABLE</span>
                          </div>
                          {/* Columns List */}
                          <div className="p-3 divide-y divide-slate-100">
                            {table.columns.map((col, cIdx) => (
                              <div key={cIdx} className="flex items-start justify-between py-2 text-xs">
                                <div className="flex items-center gap-2">
                                  {col.isPrimary && (
                                    <span title="Primary Key" className="flex-shrink-0">
                                      <Key className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                                    </span>
                                  )}
                                  {col.isForeign && (
                                    <span title="Foreign Key" className="flex-shrink-0">
                                      <Key className="w-3.5 h-3.5 text-sky-400/80" />
                                    </span>
                                  )}
                                  <span className={`font-mono font-bold ${col.isPrimary ? 'text-amber-500/95' : col.isForeign ? 'text-sky-400/90' : 'text-slate-700'}`}>
                                    {col.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                  <span className="font-mono text-slate-500 text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">{col.type}</span>
                                  {col.notes && <span className="text-[11px] text-slate-500 max-w-[150px] md:max-w-[200px] truncate" title={col.notes}>{col.notes}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Relationships if any */}
                          {table.relationships && table.relationships.length > 0 && (
                            <div className="bg-slate-50 border-t border-slate-200/60 p-3">
                              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Relationships:</p>
                              <div className="flex flex-col gap-1">
                                {table.relationships.map((rel, rIdx) => (
                                  <span key={rIdx} className="font-mono text-[10px] text-slate-600 bg-slate-100/50 px-2 py-1 rounded border border-slate-200 border-dashed">
                                    {rel}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 3: API ENDPOINTS */}
                {(activeTab === 'all' || activeTab === 'api') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <Terminal className="w-5 h-5 text-violet-500" />
                        Section 3: API Endpoints
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">RESTful Resources</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      Standard RESTful endpoints to coordinate application operations between the client and server.
                    </p>

                    <div className="space-y-4">
                      {blueprint.apiEndpoints.map((endpoint, eIdx) => (
                        <div key={eIdx} className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2.5">
                              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${getMethodColor(endpoint.method)}`}>
                                {endpoint.method.toUpperCase()}
                              </span>
                              <span className="font-mono font-bold text-sm text-slate-800">{endpoint.path}</span>
                            </div>
                            <span className="text-xs text-slate-500">{endpoint.description}</span>
                          </div>

                          {/* Request/Response bodies */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
                            {endpoint.requestBody && endpoint.requestBody !== 'null' ? (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Request Payload:</p>
                                <pre className="text-[11px] font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 overflow-x-auto whitespace-pre-wrap">
                                  {endpoint.requestBody}
                                </pre>
                              </div>
                            ) : (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Request Payload:</p>
                                <p className="text-[11px] font-mono italic text-slate-400 bg-slate-50 p-2 rounded border border-slate-200/50">No request body required</p>
                              </div>
                            )}
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Response Payload:</p>
                              <pre className="text-[11px] font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700 overflow-x-auto whitespace-pre-wrap">
                                {endpoint.responseBody}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 4: TECHNOLOGY STACK RECOMMENDATION */}
                {(activeTab === 'all' || activeTab === 'tech') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <Cpu className="w-5 h-5 text-violet-500" />
                        Section 4: Technology Stack Recommendation
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Optimized Tier</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      A modern tech stack recommendation covering frontend, backend, database, and background services.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { title: 'Frontend Stack', icon: Globe, detail: blueprint.techStack.frontend },
                        { title: 'Backend Stack', icon: Server, detail: blueprint.techStack.backend },
                        { title: 'Database Stack', icon: Database, detail: blueprint.techStack.database },
                        { title: 'Other Infrastructure', icon: Layers, detail: blueprint.techStack.other }
                      ].map((stack, sIdx) => (
                        <div key={sIdx} className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <stack.icon className="w-4 h-4 text-violet-500" />
                              <h5 className="text-sm font-bold text-slate-800">{stack.title}</h5>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {stack.detail.technologies.map((tech, tIdx) => (
                                <span key={tIdx} className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-md">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {stack.detail.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 5: DEPLOYMENT SUGGESTION */}
                {(activeTab === 'all' || activeTab === 'deployment') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <Globe className="w-5 h-5 text-violet-500" />
                        Section 5: Deployment Suggestion
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Free Tier Friendly</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      Zero-cost staging and launch suggestions using modern cloud developer platforms.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {blueprint.deployment.map((dep, dIdx) => (
                        <div key={dIdx} className="bg-white border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-bold text-slate-800 text-sm">{dep.platform}</h5>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {dep.cost}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-violet-550 mb-3">{dep.purpose}</p>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-2">
                            {dep.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 6: BASIC COST ESTIMATION */}
                {(activeTab === 'all' || activeTab === 'cost') && (
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h4 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                        <DollarSign className="w-5 h-5 text-violet-500" />
                        Section 6: Basic Cost Estimation
                      </h4>
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">Scale Breakdown</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">
                      Estimated monthly infrastructure costs for small-scale, medium-scale, and enterprise deployments.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { name: 'Small-Scale', tier: blueprint.costEstimation.small, badge: 'Hobby / Validation', color: 'from-cyan-50 to-blue-50/20' },
                        { name: 'Medium-Scale', tier: blueprint.costEstimation.medium, badge: 'Growth / Production', color: 'from-violet-50 to-indigo-50/20' },
                        { name: 'Large-Scale', tier: blueprint.costEstimation.large, badge: 'Enterprise Scale', color: 'from-fuchsia-50 to-pink-50/20' }
                      ].map((cost, cIdx) => (
                        <div key={cIdx} className={`bg-gradient-to-br ${cost.color} border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden`}>
                          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                          <div>
                            <div className="mb-4">
                              <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                                {cost.name}
                              </span>
                              <p className="text-xs text-slate-500 mt-2.5 font-medium">{cost.tier.users}</p>
                            </div>

                            <div className="mb-5">
                              <span className="text-3xl font-extrabold text-slate-800">{cost.tier.monthlyCost}</span>
                              <span className="text-xs text-slate-500"> / month</span>
                            </div>

                            <div className="border-t border-slate-200/80 pt-4 mb-4">
                              <p className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Resource Breakdown:</p>
                              <ul className="space-y-1.5">
                                {cost.tier.breakdown.map((item, iIdx) => (
                                  <li key={iIdx} className="text-xs text-slate-650 flex items-start gap-2 text-slate-650">
                                    <span className="text-violet-500 flex-shrink-0">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="border-t border-slate-200/80 pt-4 mt-3">
                            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Recommendation:</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                              &quot;{cost.tier.recommendation}&quot;
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ArchitectureStudio key={blueprint.systemArchitecture} blueprint={blueprint} idea={idea} />

                {/* Search Another Button at the bottom */}
                <div className="mt-8 flex justify-center pb-6">
                  <button 
                    onClick={() => {
                      setStatus('idle');
                      setBlueprint(null);
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-violet-500/20 active:scale-[0.98]"
                  >
                    <ArrowRight className="w-4 h-4 rotate-180" />
                    Search Another App Idea
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-slate-50/50 backdrop-blur-sm relative z-10">
          <p>© 2026 AI System Architect. Powered by Gemini Generative Models & Mermaid.js. No storage, no track, purely prompt-to-blueprint.</p>
        </footer>
      </main>
    </>
  );
}