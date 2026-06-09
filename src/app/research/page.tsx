'use client';

import React from 'react';
import DashboardLayout from '../dashboard/layout';
import { trpc } from '@/utils/trpc';
import { BookOpen, RefreshCw, Bookmark, Clock, Award, AlertCircle } from 'lucide-react';

export default function ResearchPage() {
  // Query CS.AI academic breakthrough signals
  const { data: signals, isLoading, refetch, isRefetching } = trpc.signals.getSignals.useQuery({ category: 'General' });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-display font-extrabold text-coffee-cream flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-coffee-accent animate-pulse" />
              Research Hub
            </h1>
            <p className="text-xs text-coffee-text-muted">Track ArXiv papers, benchmark breakthroughs, and deep learning algorithms impacting AI development.</p>
          </div>
          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="px-3 py-1.5 bg-coffee-dark hover:bg-coffee-border/40 border border-coffee-border/60 text-coffee-cream rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh Research</span>
          </button>
        </div>

        {/* Loader */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <RefreshCw className="w-8 h-8 text-coffee-accent animate-spin" />
            <p className="text-xs text-coffee-text-muted">Parsing academic publications...</p>
          </div>
        ) : !signals || signals.length === 0 ? (
          <div className="glass-panel p-12 rounded-xl text-center space-y-4 max-w-md mx-auto mt-12">
            <AlertCircle className="w-8 h-8 text-coffee-accent mx-auto" />
            <h3 className="text-sm font-bold text-coffee-cream">No Publications</h3>
            <p className="text-xs text-coffee-text-muted">Check back later or seed default research abstracts.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {signals.map((signal) => {
              let parsedContent: any = null;
              try {
                parsedContent = JSON.parse(signal.content);
              } catch (e) {
                parsedContent = {
                  body: signal.content,
                  tldr: signal.content,
                  whyItMatters: 'Scientific research update.',
                  confidenceScore: 90,
                  credibilityScore: 95
                };
              }

              return (
                <div 
                  key={signal.id} 
                  className="glass-panel p-6 rounded-xl border border-coffee-border/40 bg-[#0f0a08]/90 space-y-4 shadow-md hover:border-coffee-accent/40 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-coffee-accent bg-[#070403] px-2 py-0.5 rounded border border-coffee-accent/20">
                        Paper / Breakthrough
                      </span>
                      <h3 className="text-base font-display font-extrabold text-coffee-cream pt-1.5">
                        {signal.title}
                      </h3>
                      <div className="flex items-center gap-3 text-[10px] text-coffee-text-muted font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(signal.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span>Source: ArXiv CS.AI</span>
                      </div>
                    </div>
                  </div>

                  {/* TL;DR Abstract Summary */}
                  <div className="p-4 bg-[#070403] border border-coffee-border/40 rounded-lg text-xs leading-relaxed text-coffee-cream">
                    <span className="block text-[8px] font-mono uppercase text-coffee-accent tracking-wider mb-1">Abstract TL;DR</span>
                    <p>{parsedContent.tldr}</p>
                  </div>

                  {/* Why it matters */}
                  <div className="p-4 bg-coffee-dark/30 border border-coffee-border/20 rounded-lg text-xs space-y-1">
                    <h4 className="font-bold text-coffee-cream flex items-center gap-1 text-[10.5px]">
                      <Award className="w-3.5 h-3.5 text-coffee-accent" />
                      Strategic Impact & Discoveries
                    </h4>
                    <p className="text-coffee-text-muted leading-relaxed pt-0.5">
                      {parsedContent.whyItMatters}
                    </p>
                  </div>

                  {/* Scores */}
                  <div className="flex gap-6 pt-1 text-[10px] font-mono text-coffee-text-muted">
                    <div>
                      Confidence Score:{' '}
                      <span className="text-emerald-500 font-bold">{parsedContent.confidenceScore}%</span>
                    </div>
                    <div>
                      Source Credibility:{' '}
                      <span className="text-emerald-500 font-bold">{parsedContent.credibilityScore}%</span>
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
