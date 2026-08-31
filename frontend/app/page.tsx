'use client';

import React, { useState } from 'react';
import AuditGenerator from '@/components/AuditGenerator';
import AuditView from '@/components/AuditView';
import OptimizationReviewRoom from '@/components/OptimizationReviewRoom';
import ChannelSyncModal from '@/components/ChannelSyncModal';
import { generateMarrakechSolutions } from '@/lib/marrakech_engine';
import { Sparkles, ArrowRight, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [audit, setAudit] = useState<any | null>(null);
  const [solution, setSolution] = useState<any | null>(null);
  const [isAuditLoading, setIsAuditLoading] = useState(false);
  const [isSolutionLoading, setIsSolutionLoading] = useState(false);

  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [activeSyncTitle, setActiveSyncTitle] = useState('');
  const [activeSyncDesc, setActiveSyncDesc] = useState('');

  const handleAuditGenerated = (data: any) => {
    setAudit(data);
    setSolution(null);
    setTimeout(() => {
      const el = document.getElementById('audit-results-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleLaunchSolutions = async (auditId: string) => {
    setIsSolutionLoading(true);
    try {
      const res = await fetch(`/api/audit/${auditId}/generate-solutions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit }),
      });

      if (res.ok) {
        const data = await res.json();
        setSolution(data);
      } else {
        const fallbackSolutions = generateMarrakechSolutions(audit);
        setSolution(fallbackSolutions);
      }
      setTimeout(() => {
        const el = document.getElementById('solution-review-room');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } catch (err: any) {
      const fallbackSolutions = generateMarrakechSolutions(audit);
      setSolution(fallbackSolutions);
      setTimeout(() => {
        const el = document.getElementById('solution-review-room');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } finally {
      setIsSolutionLoading(false);
    }
  };

  const handleOpenSyncModal = (title: string, desc: string) => {
    setActiveSyncTitle(title);
    setActiveSyncDesc(desc);
    setSyncModalOpen(true);
  };

  const handleReset = () => {
    setAudit(null);
    setSolution(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 pb-24">
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                CONCIERGE AUDIT <span className="text-brand-400">OS</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1 font-mono uppercase tracking-widest">
                Marrakech STR Revenue & Multi-Agent Engine
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
              audit ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
            }`}>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              1. Audit Marrakech
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
              solution ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              2. Copywriting & Photos
            </div>
            <ArrowRight className="w-3 h-3 text-slate-600" />
            <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${
              solution?.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              3. Dispatch & PMS Sync
            </div>
          </div>

          <div className="flex items-center gap-3">
            {audit && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Nouvel Audit
              </button>
            )}
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Marrakech v2.4 Online
            </span>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-brand-300 mb-4">
          <Zap className="w-3.5 h-3.5 text-brand-400" />
          Système Multi-Agents Dédié à la Conciergerie à Marrakech
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Transformez vos annonces à Marrakech en <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-cyan-300 to-emerald-400">Actifs à Haut Rendement</span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
          Audit quantitatif des fuites de revenus, benchmarking par quartier (Guéliz, Médina, Hivernage, Palmeraie), copywriting OTA haute conversion et synchronisation PMS.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <section>
          <AuditGenerator
            onAuditGenerated={handleAuditGenerated}
            isLoading={isAuditLoading}
          />
        </section>

        {audit && (
          <section id="audit-results-section" className="animate-in fade-in slide-in-from-bottom-6 duration-300">
            <AuditView
              audit={audit}
              onLaunchSolutions={handleLaunchSolutions}
              isSolutionLoading={isSolutionLoading}
            />
          </section>
        )}

        {solution && (
          <section id="solution-review-room" className="animate-in fade-in slide-in-from-bottom-8 duration-300">
            <OptimizationReviewRoom
              audit={audit}
              solution={solution}
              onOpenSyncModal={handleOpenSyncModal}
            />
          </section>
        )}
      </div>

      {syncModalOpen && audit && (
        <ChannelSyncModal
          auditId={audit.audit_id}
          selectedTitle={activeSyncTitle}
          selectedDescription={activeSyncDesc}
          onClose={() => setSyncModalOpen(false)}
        />
      )}
    </main>
  );
}
