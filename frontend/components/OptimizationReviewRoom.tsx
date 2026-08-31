'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, CheckCircle2, Sliders, Image as ImageIcon, Send, ArrowRight, FileCheck, Layers } from 'lucide-react';

interface OptimizationReviewRoomProps {
  audit: any;
  solution: any;
  onOpenSyncModal: (selectedTitle: string, selectedDescription: string) => void;
}

export default function OptimizationReviewRoom({ audit, solution, onOpenSyncModal }: OptimizationReviewRoomProps) {
  const [selectedTitleIdx, setSelectedTitleIdx] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'titles' | 'description' | 'photos' | 'diff'>('titles');
  const [customDescription, setCustomDescription] = useState(solution.full_compiled_description);
  const [isApproved, setIsApproved] = useState(solution.status === 'APPROVED');

  const selectedTitle = solution.title_variants[selectedTitleIdx].title;

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
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand-500/20 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Agent 2: Listing Solution & OTA Copywriting
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {isApproved ? 'HITL APPROVED' : 'PENDING OWNER VALIDATION'}
            </span>
          </div>
          <h2 className="text-2xl font-bold mt-2 tracking-tight">Optimization Review Room</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Review algorithmic A/B title variants, 4-block direct-response copy, and hero photo sequences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => copyToClipboard(
              `TITLE:\n${selectedTitle}\n\nDESCRIPTION:\n${customDescription}`,
              'global_bundle'
            )}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
          >
            {copiedKey === 'global_bundle' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            {copiedKey === 'global_bundle' ? 'Copied Full Bundle!' : '1-Click Copy All'}
          </button>

          <button
            onClick={handleApprove}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve & Sync Channel
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-6 border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('titles')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'titles' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          A/B Title Formulas ({solution.title_variants.length})
        </button>

        <button
          onClick={() => setActiveTab('description')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'description' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          4-Block Listing Description
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'photos' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Hero Photo Matrix (5-Shot)
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'diff' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Side-by-Side Current vs AI
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'titles' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Select your primary title for automated channel manager dispatch or click to copy any variant.
            </p>

            <div className="space-y-3">
              {solution.title_variants.map((v: any, idx: number) => {
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
                          Variant {idx + 1}: {v.variant_type}
                        </span>
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {v.character_count} chars (Mobile Compliant)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(v.title, `title_${idx}`);
                        }}
                        className="text-xs flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2 py-1 bg-white rounded border border-slate-200 shadow-sm"
                      >
                        {copiedKey === `title_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === `title_${idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>

                    <div className="text-base font-bold text-slate-900 pl-6">
                      {v.title}
                    </div>

                    <p className="text-xs text-slate-500 pl-6 mt-1">
                      <strong className="text-slate-700">Strategy:</strong> {v.strategy_note}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.description_blocks.map((block: any, idx: number) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                      Block {idx + 1}: {block.heading}
                    </span>
                    <button
                      onClick={() => copyToClipboard(block.content, `block_${idx}`)}
                      className="text-[11px] flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2 py-1 bg-white rounded border border-slate-200"
                    >
                      {copiedKey === `block_${idx}` ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copiedKey === `block_${idx}` ? 'Copied' : 'Copy Block'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200/60">
                    {block.content}
                  </p>

                  <p className="text-[11px] text-slate-500 italic">
                    Purpose: {block.purpose}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Compiled Description (Ready for OTA Dispatch)
                </label>
                <button
                  onClick={() => copyToClipboard(customDescription, 'full_desc')}
                  className="text-xs flex items-center gap-1 text-slate-700 hover:text-brand-600 font-bold px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200"
                >
                  {copiedKey === 'full_desc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'full_desc' ? 'Copied Full Description' : 'Copy Complete Description'}
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

        {activeTab === 'photos' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Mobile scrollers look at the first 5 photos before deciding to click. Follow this exact sequence:
            </p>

            <div className="space-y-3">
              {solution.photo_strategy.map((p: any, idx: number) => (
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
                        <strong className="text-slate-700">Staging:</strong> {p.staging_notes}
                      </p>
                      <div className="mt-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block text-xs font-medium text-slate-800">
                        <span className="text-slate-400 mr-1.5 font-bold">Caption:</span>
                        "{p.recommended_caption}"
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(p.recommended_caption, `caption_${idx}`)}
                    className="text-xs flex items-center gap-1 text-slate-600 hover:text-brand-600 font-medium px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm"
                  >
                    {copiedKey === `caption_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === `caption_${idx}` ? 'Copied' : 'Copy Caption'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50/40 border border-red-200/80 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-700">Current Listing (Sub-optimal)</span>
                <span className="text-xs font-bold text-red-600">Score: {audit.breakdown.overall_score}/100</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Title</span>
                <div className="text-sm font-semibold text-slate-800 mt-0.5 line-through decoration-red-400">
                  {audit.property_input.current_title || 'No Title Found'}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Description</span>
                <p className="text-xs text-slate-600 mt-0.5 bg-white p-3 rounded-lg border border-red-200/60 leading-relaxed whitespace-pre-line">
                  {audit.property_input.current_description || 'Unstructured, vague description.'}
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">AI-Optimized Solution</span>
                <span className="text-xs font-bold text-emerald-700">Est. Target: 92/100</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">High-CTR Title</span>
                <div className="text-sm font-bold text-emerald-900 mt-0.5">
                  {selectedTitle}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase">4-Block Structured Copy</span>
                <p className="text-xs text-slate-800 mt-0.5 bg-white p-3 rounded-lg border border-emerald-200/60 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-line">
                  {customDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
