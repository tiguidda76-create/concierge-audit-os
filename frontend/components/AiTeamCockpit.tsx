'use client';

import React from 'react';
import { Bot, Sparkles, CheckCircle2, ArrowRight, Zap, RefreshCw, Layers, Calendar, MessageSquare, Shield, Activity } from 'lucide-react';
import { MARRAKECH_EVENTS_RADAR } from '@/lib/marrakech_engine';

interface AiTeamCockpitProps {
  audit: any;
  onTriggerAgent2: () => void;
  onOpenSyncModal: () => void;
  onOpenOwnerCloser: () => void;
  isSolutionLoading: boolean;
}

export default function AiTeamCockpit({
  audit,
  onTriggerAgent2,
  onOpenSyncModal,
  onOpenOwnerCloser,
  isSolutionLoading,
}: AiTeamCockpitProps) {
  const currentDistrict = audit?.property_input?.district || 'Guéliz';

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden text-slate-100 space-y-0 animate-in fade-in duration-300">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                5 Agents IA Autonomes Actifs
              </span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
              Cockpit d'Automatisation Multi-Agents
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Marché : Marrakech</span> • <span>Devise : MAD</span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Agent 01</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white">Revenue Auditor</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Scraping de l'annonce & calcul des fuites face au Top 10%.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Audit Complété
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wide">Agent 02</span>
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            </div>
            <h4 className="text-xs font-extrabold text-white">Copywriter & Visuals</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              3 titres A/B haute conversion & 5 photos héro.
            </p>
          </div>
          <button
            type="button"
            onClick={onTriggerAgent2}
            disabled={isSolutionLoading}
            className="w-full text-center text-[10px] font-bold bg-brand-600 hover:bg-brand-700 text-white py-1.5 px-2 rounded-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isSolutionLoading ? 'Génération...' : 'Lancer le Copywriting'}
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wide">Agent 03</span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white">PMS Dispatcher</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Synchronisation Hostaway, Guesty, Smoobu.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSyncModal}
            className="w-full text-center text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-purple-300 py-1.5 px-2 rounded-lg border border-purple-500/30 transition-all cursor-pointer"
          >
            Sync Channel PMS
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">Agent 04</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <h4 className="text-xs font-extrabold text-white">Event Radar Yield</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Surveillance FIFM, Nouvel An, Pâques (+35% à +85%).
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-1">
              <Calendar className="w-3 h-3" /> 5 Pics Détectés
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 flex flex-col justify-between space-y-3 bg-gradient-to-b from-slate-950 to-emerald-950/40">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Agent 05</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-xs font-extrabold text-white">Owner Closer (Mandat)</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Générateur WhatsApp & Email pour signer le client.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenOwnerCloser}
            className="w-full text-center text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 text-white py-1.5 px-2 rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Générer Pitch WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
