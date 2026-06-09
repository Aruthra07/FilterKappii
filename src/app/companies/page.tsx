'use client';

import React from 'react';
import DashboardLayout from '../dashboard/layout';
import { trpc } from '@/utils/trpc';
import { TrendingUp, RefreshCw, Briefcase, DollarSign, Award, Settings } from 'lucide-react';

export default function CompaniesPage() {
  const { data: trendsData, isLoading, refetch, isRefetching } = trpc.signals.getTrends.useQuery();

  // Filter trends to companies only
  const companies = trendsData?.ai.filter((item) => item.type === 'COMPANY') || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-coffee-cream flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-coffee-accent" />
              AI Company Tracker
            </h1>
            <p className="text-xs text-coffee-text-muted">Track strategic movements, acquisitions, total funding, and hiring updates for AI giant corporations.</p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="px-3 py-1.5 bg-coffee-dark hover:bg-coffee-border/40 border border-coffee-border/60 text-coffee-cream rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Companies</span>
          </button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-coffee-accent animate-spin" />
            <p className="text-xs text-coffee-text-muted">Loading corporate data...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl text-center space-y-4 max-w-md mx-auto mt-12">
            <Settings className="w-8 h-8 text-coffee-accent mx-auto" />
            <h3 className="text-sm font-bold text-coffee-cream">No Companies Tracked</h3>
            <p className="text-xs text-coffee-text-muted">Check back later or seed default profile parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companies.map((company) => {
              let specs = {
                funding: 'N/A',
                acquisitions: 'N/A',
                hiring: 'N/A',
                strategicMoves: 'N/A'
              };

              try {
                specs = JSON.parse(company.description);
              } catch (e) {
                specs.strategicMoves = company.description;
              }

              return (
                <div 
                  key={company.id}
                  className="glass-panel rounded-xl border border-coffee-border/40 hover:border-coffee-accent/40 bg-[#0f0a08]/90 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-coffee-accent/5 hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div className="h-[2px] w-full bg-gradient-to-r from-coffee-accent/20 via-coffee-accent to-coffee-accent/20" />
                  
                  <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-display font-extrabold text-coffee-cream">
                        {company.company}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-bold uppercase bg-coffee-border/50 text-coffee-accent border border-coffee-accent/20">
                        Level 1 Giant
                      </span>
                    </div>

                    {/* Stats Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 text-xs py-3 border-t border-b border-coffee-border/20">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-coffee-text-muted uppercase tracking-wider flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3 text-coffee-accent" />
                          Funding
                        </span>
                        <p className="font-bold text-coffee-cream text-xs truncate" title={specs.funding}>
                          {specs.funding}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-coffee-text-muted uppercase tracking-wider flex items-center gap-0.5">
                          <Award className="w-3 h-3 text-coffee-accent" />
                          Acquisitions
                        </span>
                        <p className="font-bold text-coffee-cream text-xs truncate" title={specs.acquisitions}>
                          {specs.acquisitions}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-coffee-text-muted uppercase tracking-wider flex items-center gap-0.5">
                          <Briefcase className="w-3 h-3 text-coffee-accent" />
                          Hiring Rate
                        </span>
                        <p className="font-bold text-coffee-cream text-xs truncate" title={specs.hiring}>
                          {specs.hiring}
                        </p>
                      </div>
                    </div>

                    {/* Strategic Moves */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-coffee-accent uppercase tracking-wider text-[8px]">Strategic Focus & Alliances</span>
                      <p className="text-xs text-coffee-cream/80 leading-relaxed bg-[#070403] p-4 rounded-lg border border-coffee-border/40">
                        {specs.strategicMoves}
                      </p>
                    </div>

                    {/* Importance description */}
                    <div className="space-y-1 text-xs pt-1.5">
                      <span className="text-[10px] font-bold text-coffee-text-muted uppercase tracking-wider text-[8px]">Pillar Importance</span>
                      <p className="text-coffee-text-muted leading-normal italic">
                        "{company.importance}"
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
