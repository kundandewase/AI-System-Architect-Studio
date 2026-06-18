'use client';

import { useState, useEffect } from 'react';

const STEPS = [
  'Analyzing application requirements...',
  'Architecting system topology flow...',
  'Drafting relational database schemas...',
  'Defining RESTful API endpoints...',
  'Selecting optimized technology stack...',
  'Structuring free-tier deployment configurations...',
  'Calculating small, medium, and large scale costs...',
  'Assembling complete architecture blueprint...'
];

export default function Loader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[450px] w-full p-8 text-center bg-white/40 rounded-2xl backdrop-blur-sm">
      {/* Outer Glow Ring */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 animate-ping" />
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm">
          <svg className="w-8 h-8 text-violet-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-800 mb-3 tracking-wide">
        Generating Architecture
      </h3>
      
      {/* Progress Steps */}
      <div className="max-w-md w-full px-4">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-200/60 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="min-h-[48px] flex flex-col justify-center mb-6">
          <p className="text-sm text-slate-700 font-semibold animate-pulse">
            {STEPS[stepIndex]}
          </p>
          <p className="text-xs text-slate-400 mt-1.5 font-mono">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step-by-Step checklist */}
        <div className="mt-4 flex flex-col items-start gap-2 max-w-xs mx-auto border-t border-slate-200 pt-6 text-left">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < stepIndex;
            const isCurrent = idx === stepIndex;
            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                {isCompleted ? (
                  <span className="text-emerald-600 font-bold w-4 text-center">✓</span>
                ) : isCurrent ? (
                  <span className="relative flex h-2 w-2 mx-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-550 bg-violet-600"></span>
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-1" />
                )}
                <span className={isCompleted ? 'text-slate-450 text-slate-400 line-through' : isCurrent ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  {step.replace('...', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
