'use client';

import React from 'react';
import DashboardLayout from '../dashboard/layout';
import { trpc } from '@/utils/trpc';
import { CreditCard, RefreshCw, Landmark, Clock, ArrowUpRight } from 'lucide-react';

export default function FundingPage() {
  // Query signals with Finance category representing VC rounds
  const { data: signals, isLoading, refetch, isRefetching } = trpc.signals.getSignals.useQuery({ category: 'Finance' });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-coffee-cream flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-coffee-accent" />
              AI Funding Tracker
            </h1>
            <p className="text-xs text-coffee-text-muted">Monitor venture capital inflows, Series A/B rounds, and major acquisition events in the AI startup ecosystem.</p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="px-3 py-1.5 bg-coffee-dark hover:bg-coffee-border/40 border border-coffee-border/60 text-coffee-cream rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Investments</span>
          </button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-coffee-accent animate-spin" />
            <p className="text-xs text-coffee-text-muted">Loading transaction records...</p>
          </div>
        ) : !signals || signals.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl text-center space-y-4 max-w-md mx-auto mt-12">
            <Landmark className="w-8 h-8 text-coffee-accent mx-auto" />
            <h3 className="text-sm font-bold text-coffee-cream">No Capital Movements</h3>
            <p className="text-xs text-coffee-text-muted">Check back later or seed default transactional signals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {signals.map((signal) => {
              let parsedContent: any = null;
              try {
                parsedContent = JSON.parse(signal.content);
              } catch (e) {
                parsedContent = {
                  body: signal.content,
                  tldr: signal.content,
                  whyItMatters: 'Startup investment update.',
                  businessImpact: 'Market scaling.'
                };
              }

              return (
                <div 
                  key={signal.id} 
                  className="glass-panel p-6 rounded-xl border border-coffee-border/40 hover:border-coffee-accent/40 bg-[#0f0a08]/90 space-y-4 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-coffee-accent bg-[#070403] px-2 py-0.5 rounded border border-coffee-accent/20">
                        Capital Signal
                      </span>
                      <span className="text-[10px] text-coffee-text-muted font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(signal.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-coffee-cream hover:text-coffee-accent transition-colors flex items-center gap-1">
                      {signal.title}
                      <ArrowUpRight className="w-4 h-4 shrink-0 text-coffee-text-muted" />
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-coffee-cream/80 bg-[#070403] p-3.5 rounded border border-coffee-border/40 leading-relaxed">
                      {parsedContent.tldr}
                    </p>
                  </div>

                  {/* Impact Columns */}
                  <div className="space-y-2 pt-3 border-t border-coffee-border/20 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-coffee-accent uppercase tracking-wider">Business Impact</span>
                      <p className="text-coffee-text-muted leading-normal">
                        {parsedContent.businessImpact || parsedContent.whyItMatters}
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
