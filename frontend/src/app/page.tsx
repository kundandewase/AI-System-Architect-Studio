'use client';

import { useState } from 'react';
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

export default function Home() {
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
    <main className="flex-1 flex flex-col bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* App Header */}
      <header className="relative border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              AI System Architect
            </h1>
            <p className="text-xs text-zinc-500 font-medium">Gemini 2.5 Blueprint Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-zinc-400 font-medium font-mono">Engine: Online</span>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="relative flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 z-10">
        
        {/* Input Panel */}
        <section className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <h2 className="text-xl font-bold text-zinc-100 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Describe Your App Idea
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            Enter your application concept in plain English. The AI architect will parse it and generate standard database schemas, API routes, topology diagrams, and infrastructure cost estimations.
          </p>

          <div className="relative">
            <textarea
              className="w-full h-32 bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 pr-12 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none transition-all duration-300"
              placeholder="e.g., I want to build a real-time chat application with group channels, file sharing, and message delivery statuses..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={status === 'loading'}
            />
            <div className="absolute bottom-4 right-4 flex items-center">
              <button
                onClick={() => handleGenerate()}
                disabled={status === 'loading' || !idea.trim()}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm flex items-center gap-2 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/20 active:scale-[0.98]"
              >
                {status === 'loading' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Architecting...
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4">
            <p className="text-xs text-zinc-500 font-semibold mb-2 uppercase tracking-wider">Or try an example:</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => selectPreset(preset)}
                  disabled={status === 'loading'}
                  className="text-xs text-left px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800/80 hover:border-violet-500/50 hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition-all duration-200 active:scale-[0.98]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-2xl p-8 backdrop-blur-sm shadow-inner flex items-center justify-center">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6 backdrop-blur-sm flex items-start gap-4">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-400 mb-1">Architecture Pipeline Interrupted</h3>
              <p className="text-sm text-zinc-400 mb-4">{error}</p>
              <div className="bg-black/30 border border-zinc-900 p-4 rounded-xl max-w-xl">
                <p className="text-xs font-semibold text-zinc-300 mb-1">Troubleshooting Tips:</p>
                <ul className="text-xs text-zinc-500 list-disc list-inside space-y-1">
                  <li>Ensure your `GEMINI_API_KEY` is added to the `.env` file in the backend directory.</li>
                  <li>Verify the Express backend is running on `http://localhost:3001` (run `npm run dev` in backend).</li>
                  <li>Check terminal outputs in the backend for specific Gemini API quota limits or network errors.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success / Result State */}
        {status === 'success' && blueprint && (
          <div className="flex flex-col gap-6 animate-fade-in">
            
            {/* Report Header Tab Bar */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-zinc-100 text-lg">Generated Architecture Report</h3>
              </div>
              
              {/* Tab Navigation */}
              <div className="flex items-center bg-zinc-950 border border-zinc-900 p-1 rounded-xl overflow-x-auto max-w-full">
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
                        ? 'bg-zinc-800 text-zinc-100'
                        : 'text-zinc-500 hover:text-zinc-300'
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
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-violet-400" />
                      Section 1: System Architecture Diagram
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Mermaid.js Flowchart</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    A visual flowchart of client-server components, api boundaries, databases, and third-party gateways.
                  </p>
                  <Mermaid chart={blueprint.systemArchitecture} />
                </div>
              )}

              {/* SECTION 2: DATABASE SCHEMA */}
              {(activeTab === 'all' || activeTab === 'database') && (
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <Database className="w-5 h-5 text-violet-400" />
                      Section 2: Database Schema
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Relational Database</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Structured tables, columns, primary/foreign keys, and data relationships to model your business requirements.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {blueprint.databaseSchema.map((table, tIdx) => (
                      <div key={tIdx} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-md">
                        {/* Table Name */}
                        <div className="bg-zinc-900/80 border-b border-zinc-800/80 px-4 py-3 flex items-center justify-between">
                          <span className="font-mono font-bold text-zinc-200 text-sm">{table.tableName}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">TABLE</span>
                        </div>
                        {/* Columns List */}
                        <div className="p-3 divide-y divide-zinc-900/50">
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
                                <span className={`font-mono font-bold ${col.isPrimary ? 'text-amber-500/95' : col.isForeign ? 'text-sky-400/90' : 'text-zinc-300'}`}>
                                  {col.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-right">
                                <span className="font-mono text-zinc-500 text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800/50">{col.type}</span>
                                {col.notes && <span className="text-[11px] text-zinc-400 max-w-[150px] md:max-w-[200px] truncate" title={col.notes}>{col.notes}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Relationships if any */}
                        {table.relationships && table.relationships.length > 0 && (
                          <div className="bg-zinc-900/30 border-t border-zinc-800/50 p-3">
                            <p className="text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Relationships:</p>
                            <div className="flex flex-col gap-1">
                              {table.relationships.map((rel, rIdx) => (
                                <span key={rIdx} className="font-mono text-[10px] text-zinc-400 bg-zinc-950/50 px-2 py-1 rounded border border-zinc-900 border-dashed">
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
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <Terminal className="w-5 h-5 text-violet-400" />
                      Section 3: API Endpoints
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">RESTful Resources</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Standard RESTful endpoints to coordinate application operations between the client and server.
                  </p>

                  <div className="space-y-4">
                    {blueprint.apiEndpoints.map((endpoint, eIdx) => (
                      <div key={eIdx} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl overflow-hidden shadow-md p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${getMethodColor(endpoint.method)}`}>
                              {endpoint.method.toUpperCase()}
                            </span>
                            <span className="font-mono font-bold text-sm text-zinc-200">{endpoint.path}</span>
                          </div>
                          <span className="text-xs text-zinc-400">{endpoint.description}</span>
                        </div>

                        {/* Request/Response bodies */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-3 border-t border-zinc-900/80">
                          {endpoint.requestBody && endpoint.requestBody !== 'null' ? (
                            <div>
                              <p className="text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Request Payload:</p>
                              <pre className="text-[11px] font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-zinc-400 overflow-x-auto whitespace-pre-wrap">
                                {endpoint.requestBody}
                              </pre>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Request Payload:</p>
                              <p className="text-[11px] font-mono italic text-zinc-600 bg-zinc-950/30 p-2 rounded border border-zinc-900/50">No request body required</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[10px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider">Response Payload:</p>
                            <pre className="text-[11px] font-mono bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-zinc-400 overflow-x-auto whitespace-pre-wrap">
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
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-violet-400" />
                      Section 4: Technology Stack Recommendation
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Optimized Tier</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    A modern tech stack recommendation covering frontend, backend, database, and background services.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { title: 'Frontend Stack', icon: Globe, detail: blueprint.techStack.frontend },
                      { title: 'Backend Stack', icon: Server, detail: blueprint.techStack.backend },
                      { title: 'Database Stack', icon: Database, detail: blueprint.techStack.database },
                      { title: 'Other Infrastructure', icon: Layers, detail: blueprint.techStack.other }
                    ].map((stack, sIdx) => (
                      <div key={sIdx} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between shadow-md">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <stack.icon className="w-4 h-4 text-violet-400" />
                            <h5 className="text-sm font-bold text-zinc-300">{stack.title}</h5>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {stack.detail.technologies.map((tech, tIdx) => (
                              <span key={tIdx} className="text-xs font-semibold text-violet-300 bg-violet-500/5 border border-violet-500/20 px-2.5 py-1 rounded-md">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                          {stack.detail.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: DEPLOYMENT SUGGESTION */}
              {(activeTab === 'all' || activeTab === 'deployment') && (
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-violet-400" />
                      Section 5: Deployment Suggestion
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Free Tier Friendly</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Zero-cost staging and launch suggestions using modern cloud developer platforms.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blueprint.deployment.map((dep, dIdx) => (
                      <div key={dIdx} className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-5 flex flex-col justify-between shadow-md">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-zinc-200 text-sm">{dep.platform}</h5>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {dep.cost}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-violet-400 mb-3">{dep.purpose}</p>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3 mt-2">
                          {dep.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 6: BASIC COST ESTIMATION */}
              {(activeTab === 'all' || activeTab === 'cost') && (
                <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg">
                  <div className="flex items-center justify-between mb-4 border-b border-zinc-800/50 pb-3">
                    <h4 className="text-base font-bold text-zinc-200 flex items-center gap-2.5">
                      <DollarSign className="w-5 h-5 text-violet-400" />
                      Section 6: Basic Cost Estimation
                    </h4>
                    <span className="text-xs font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">Scale Breakdown</span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-6">
                    Estimated monthly infrastructure costs for small-scale, medium-scale, and enterprise deployments.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Small-Scale', tier: blueprint.costEstimation.small, badge: 'Hobby / Validation', color: 'from-cyan-500/10 to-blue-500/5' },
                      { name: 'Medium-Scale', tier: blueprint.costEstimation.medium, badge: 'Growth / Production', color: 'from-violet-500/10 to-indigo-500/5' },
                      { name: 'Large-Scale', tier: blueprint.costEstimation.large, badge: 'Enterprise Scale', color: 'from-fuchsia-500/10 to-pink-500/5' }
                    ].map((cost, cIdx) => (
                      <div key={cIdx} className={`bg-gradient-to-br ${cost.color} border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div>
                          <div className="mb-4">
                            <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-900">
                              {cost.name}
                            </span>
                            <p className="text-xs text-zinc-500 mt-2.5 font-medium">{cost.tier.users}</p>
                          </div>

                          <div className="mb-5">
                            <span className="text-3xl font-extrabold text-zinc-100">{cost.tier.monthlyCost}</span>
                            <span className="text-xs text-zinc-500"> / month</span>
                          </div>

                          <div className="border-t border-zinc-900 pt-4 mb-4">
                            <p className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wider">Resource Breakdown:</p>
                            <ul className="space-y-1.5">
                              {cost.tier.breakdown.map((item, iIdx) => (
                                <li key={iIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                                  <span className="text-violet-400 flex-shrink-0">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="border-t border-zinc-900/60 pt-4 mt-3">
                          <p className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider">Recommendation:</p>
                          <p className="text-xs text-zinc-400 leading-relaxed font-medium italic">
                            &quot;{cost.tier.recommendation}&quot;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <ArchitectureStudio key={blueprint.systemArchitecture} blueprint={blueprint} idea={idea} />

            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-900 py-6 text-center text-xs text-zinc-600 bg-zinc-950/20">
        <p>© 2026 AI System Architect. Powered by Gemini Generative Models & Mermaid.js. No storage, no track, purely prompt-to-blueprint.</p>
      </footer>
    </main>
  );
}
