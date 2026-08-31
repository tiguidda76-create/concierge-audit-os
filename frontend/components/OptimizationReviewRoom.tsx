'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, CheckCircle2, Sliders, Image as ImageIcon, Send, ArrowRight, FileCheck, Layers } from 'lucide-react';
import { generateMarrakechSolutions } from '@/lib/marrakech_engine';

interface OptimizationReviewRoomProps {
  audit: any;
  solution: any;
  onOpenSyncModal: (selectedTitle: string, selectedDescription: string) => void;
}

export default function OptimizationReviewRoom({ audit, solution, onOpenSyncModal }: OptimizationReviewRoomProps) {
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'description' | 'photos' | 'diff'>('titles');
  const [customDescription, setCustomDescription] = useState(solution.full_compiled_description || '');
  const [isApproved, setIsApproved] = useState(solution.status === 'APPROVED');
  const [currentSolution, setCurrentSolution] = useState(solution);
  const [selectedTone, setSelectedTone] = useState<'LUXURY' | 'DIGITAL_NOMAD' | 'FAMILY_COMFORT'>(solution.tone_style || 'LUXURY');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const selectedTitle = currentSolution.title_variants[selectedTitleIdx]?.title || '';

  const handleToneChange = (newTone: 'LUXURY' | 'DIGITAL_NOMAD' | 'FAMILY_COMFORT') => {
    setSelectedTone(newTone);
    setIsRegenerating(true);
    try {
      const regenerated = generateMarrakechSolutions(audit, newTone);
      setCurrentSolution(regenerated);
      setCustomDescription(regenerated.full_compiled_description);
      setSelectedTitleIdx(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRegenerating(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/audit/${audit.audit_id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audit_id: audit.audit_id,
          selected_title: selectedTitle,
          approved_description: customDescription,
          applied_by: 'Owner/Concierge Manager'
        })
      });
      if (res.ok) {
        setIsApproved(true);
        onOpenSyncModal(selectedTitle, customDescription);
      }
    } catch (e) {
      console.error(e);
      onOpenSyncModal(selectedTitle, customDescription);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-500/20 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Agent 2: Copywriting Contextuel Personnalisé
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isApproved ? 'HITL VALIDÉ' : 'EN ATTENTE DE VALIDATION'}
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-2 tracking-tight">Salle d'Optimisation & Copywriting OTA</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Titres A/B haute conversion, descriptif immersif en 4 blocs et séquence des 5 photos héro calibrés pour <strong>{audit.property_input.district}</strong>.
          </p>
        </div>

        {/* Global Quick Copy & Approval */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(
              `TITLE:\n${selectedTitle}\n\nDESCRIPTION:\n${customDescription}`,
              'global_bundle'
            )}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            {copiedKey === 'global_bundle' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            {copiedKey === 'global_bundle' ? 'Pack Copié !' : 'Copier Tout le Pack'}
          </button>

          <button
            onClick={handleApprove}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Valider & Sync Channel
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DYNAMIC TONE & STYLE SWITCHER BAR */}
      <div className="mx-6 bg-slate-900 border border-slate-800 p-4 rounded-xl text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Style & Angle de Copywriting IA :
          </span>
          <span className="text-[11px] text-slate-400">
            (Régénère instantanément les textes et arguments)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'LUXURY', label: '💎 Luxe & Beldi Chic', desc: 'Prestige & International' },
            { id: 'DIGITAL_NOMAD', label: '💻 Nomade Digital & Télétravail', desc: 'Fibre & Longs Séjours' },
            { id: 'FAMILY_COMFORT', label: '👨‍👩‍👧‍👦 Famille & Sérénité', desc: 'Confort & Sécurité' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleToneChange(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTone === t.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('titles')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'titles' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Formules de Titres A/B ({currentSolution.title_variants.length})
        </button>

        <button
          onClick={() => setActiveTab('description')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'description' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Descriptif en 4 Blocs Immersifs
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'photos' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Séquence 5 Photos Héro
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'diff' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Comparatif Avant / Après IA
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* 1. TITLE VARIANTS */}
        {activeTab === 'titles' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Sélectionnez votre titre principal pour la synchronisation channel manager ou cliquez pour copier une variante.
            </p>

            <div className="space-y-3">
              {currentSolution.title_variants.map((v: any, idx: number) => {
                const isSelected = selectedTitleIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTitleIdx(idx)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 shadow-md shadow-brand-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-brand-600 bg-brand-600' : 'border-slate-400'
                        }`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Variante {idx + 1}: {v.variant_type}
                        </span>
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {v.character_count} car. (Conforme Mobile)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(v.title, `title_${idx}`);
                        }}
                        className="text-xs flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2 py-1 bg-white rounded border border-slate-200 shadow-sm cursor-pointer"
                      >
                        {copiedKey === `title_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === `title_${idx}` ? 'Copié' : 'Copier'}
                      </button>
                    </div>

                    <div className="text-base font-bold text-slate-900 pl-6">
                      {v.title}
                    </div>

                    <p className="text-xs text-slate-500 pl-6 mt-1">
                      <strong className="text-slate-700">Stratégie :</strong> {v.strategy_note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DESCRIPTION 4-BLOCKS */}
        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentSolution.description_blocks.map((block: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                      Block {idx + 1}: {block.heading}
                    </span>
                    <button
                      onClick={() => copyToClipboard(block.content, `block_${idx}`)}
                      className="text-[11px] flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2 py-1 bg-white rounded border border-slate-200 cursor-pointer"
                    >
                      {copiedKey === `block_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === `block_${idx}` ? 'Copié' : 'Copier le Bloc'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200/60">
                    {block.content}
                  </p>

                  <p className="text-[11px] text-slate-500 italic">
                    Objectif : {block.purpose}
                  </p>
                </div>
              ))}
            </div>

            {/* Editable Full Compiled Box */}
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Descriptif Intégral Compilé (Prêt pour Synchronisation OTA)
                </label>
                <button
                  onClick={() => copyToClipboard(customDescription, 'full_desc')}
                  className="text-xs flex items-center gap-1 text-slate-700 hover:text-brand-600 font-bold px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  {copiedKey === 'full_desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'full_desc' ? 'Description Complète Copiée !' : 'Copier la Description Complète'}
                </button>
              </div>

              <textarea
                rows={8}
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full text-xs text-slate-800 p-3 font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* 3. HERO PHOTO MATRIX */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Les voyageurs sur smartphone décident de cliquer en moins de 2 secondes. Suivez cet ordre de conversion recommandé :
            </p>

            <div className="space-y-3">
              {currentSolution.photo_strategy.map((p: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black flex items-center justify-center text-sm shrink-0">
                      #{p.position}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{p.shot_type}</span>
                        <span className="text-[11px] text-slate-500">({p.subject})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong className="text-slate-700">Mise en scène :</strong> {p.staging_notes}
                      </p>
                      <div className="mt-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block text-xs font-medium text-slate-800">
                        <span className="text-slate-400 mr-1.5 font-bold">Légende :</span>
                        "{p.recommended_caption}"
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(p.recommended_caption, `caption_${idx}`)}
                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm cursor-pointer"
                  >
                    {copiedKey === `caption_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === `caption_${idx}` ? 'Copié' : 'Copier la Légende'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SIDE-BY-SIDE DIFF */}
        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Avant Optimisation (Actuel)
                </span>
                <span className="text-[10px] font-semibold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                  Sous-Optimisé
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Titre Actuel :</label>
                <div className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-red-200">
                  {audit.property_input.current_title || 'Titre initial'}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Description Actuelle :</label>
                <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-red-200 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {audit.property_input.current_description || 'Description brute'}
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Après Optimisation IA Contextuelle ({selectedTone})
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Direct-Response Ready
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Titre Optimisé :</label>
                <div className="text-xs font-bold text-emerald-900 bg-white p-2.5 rounded-lg border border-emerald-200">
                  {selectedTitle}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Description 4 Blocs :</label>
                <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-emerald-200 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {customDescription}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
