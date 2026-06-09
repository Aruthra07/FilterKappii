'use client';

import React from 'react';
import DashboardLayout from '../dashboard/layout';
import { trpc } from '@/utils/trpc';
import { Cpu, RefreshCw, Layers, Zap, Calendar, Gauge } from 'lucide-react';

export default function ModelTrackerPage() {
  const { data: trendsData, isLoading, refetch, isRefetching } = trpc.signals.getTrends.useQuery();

  // Filter trends to models only
  const models = trendsData?.ai.filter((item) => item.type === 'MODEL') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-coffee-cream flex items-center gap-2">
              <Cpu className="w-6 h-6 text-coffee-accent" />
              AI Roast Tracker (Model Tracker)
            </h1>
            <p className="text-xs text-coffee-text-muted">Compare contexts, release times, and benchmarks for cutting-edge LLMs.</p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="px-3 py-1.5 bg-coffee-dark hover:bg-coffee-border/40 border border-coffee-border/60 text-coffee-cream rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Models</span>
          </button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-coffee-accent animate-spin" />
            <p className="text-xs text-coffee-text-muted">Loading model indexes...</p>
          </div>
        ) : models.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl text-center space-y-4 max-w-md mx-auto mt-12">
            <Layers className="w-8 h-8 text-coffee-accent mx-auto" />
            <h3 className="text-sm font-bold text-coffee-cream">No Models Registered</h3>
            <p className="text-xs text-coffee-text-muted">Check back later or seed default models from the Brewing Insights dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => {
              let specs = {
                releaseDate: 'N/A',
                contextWindow: 'N/A',
                mmlu: 'N/A',
                capabilities: 'N/A',
                usage: 'N/A'
              };

              try {
                specs = JSON.parse(model.description);
              } catch (e) {
                // description is plain text fallback
                specs.capabilities = model.description;
              }

              return (
                <div 
                  key={model.id}
                  className="glass-panel rounded-xl border border-coffee-border/40 hover:border-coffee-accent/40 bg-[#0f0a08]/90 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-coffee-accent/5 hover:-translate-y-1 transition-all duration-300 relative"
                >
                  {/* Decorative glowing top line */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-coffee-accent/20 via-coffee-accent to-coffee-accent/20" />
                  
                  <div className="p-6 space-y-4">
                    {/* Model Title & Company */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono font-bold text-coffee-accent bg-[#070403] px-2 py-0.5 rounded border border-coffee-accent/20">
                          {model.company}
                        </span>
                        <span className="text-[9px] font-mono text-emerald-500 bg-emerald-950/20 border border-emerald-500/20 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                      <h3 className="text-lg font-display font-extrabold text-coffee-cream pt-2">
                        {model.title}
                      </h3>
                    </div>

                    {/* Stats List */}
                    <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-b border-coffee-border/20 py-3">
                      <div className="space-y-1">
                        <span className="text-coffee-text-muted block uppercase text-[8px] tracking-wider">Released</span>
                        <span className="text-coffee-cream font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-coffee-accent" />
                          {specs.releaseDate}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-coffee-text-muted block uppercase text-[8px] tracking-wider">Context Limit</span>
                        <span className="text-coffee-cream font-bold flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-coffee-accent" />
                          {specs.contextWindow}
                        </span>
                      </div>
                      <div className="space-y-1 pt-2">
                        <span className="text-coffee-text-muted block uppercase text-[8px] tracking-wider">MMLU Score</span>
                        <span className="text-coffee-cream font-bold flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-coffee-accent" />
                          {specs.mmlu}
                        </span>
                      </div>
                      <div className="space-y-1 pt-2">
                        <span className="text-coffee-text-muted block uppercase text-[8px] tracking-wider">Developer Usage</span>
                        <span className="text-coffee-cream font-bold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-coffee-accent" />
                          {specs.usage}
                        </span>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-coffee-accent uppercase tracking-wider text-[8px]">Capabilities</span>
                      <p className="text-xs text-coffee-cream/80 leading-relaxed bg-[#070403] p-3 rounded border border-coffee-border/40">
                        {specs.capabilities}
                      </p>
                    </div>

                    {/* Market / Impact description */}
                    <div className="space-y-1 text-xs pt-1.5">
                      <span className="text-[10px] font-bold text-coffee-text-muted uppercase tracking-wider text-[8px]">Strategic Impact</span>
                      <p className="text-coffee-text-muted leading-normal italic">
                        "{model.importance}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
