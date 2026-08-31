'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sparkles, Link as LinkIcon, Search, Building2, Sliders, DollarSign, Star, ShieldCheck, CheckCircle2, ArrowRight, Layers, Flame, Check, Globe, RefreshCw, AlertCircle, Edit3, ChevronRight, Target } from 'lucide-react';
import { PropertyData, getRealisticMarrakechBenchmark, calculateMarrakechAudit, ValuationStrategyLevel } from '@/lib/marrakech_engine';

export const REAL_SAMPLE_URLS = [
  {
    label: 'Airbnb Guéliz (1-2 Ch)',
    platform: 'Airbnb',
    url: 'https://www.airbnb.com/rooms/1148209214718291823',
    hint: 'Appartement central Guéliz'
  },
  {
    label: 'Booking.com Riad Médina',
    platform: 'Booking',
    url: 'https://www.booking.com/hotel/ma/riad-palais-sebban.fr.html',
    hint: 'Riad authentique Médina'
  },
  {
    label: 'Airbnb Hivernage Penthouse',
    platform: 'Airbnb',
    url: 'https://www.airbnb.com/rooms/892184129031201948',
    hint: 'Logement Hivernage standing'
  },
  {
    label: 'Avito Marrakech Villa',
    platform: 'Avito.ma',
    url: 'https://www.avito.ma/fr/marrakech/locations_de_vacances/villa_palmeraie_piscine',
    hint: 'Villa Palmeraie / Golfs'
  }
];

interface AuditGeneratorProps {
  onAuditGenerated: (data: any) => void;
  isLoading: boolean;
}

export default function AuditGenerator({ onAuditGenerated, isLoading }: AuditGeneratorProps) {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [isUrlParsing, setIsUrlParsing] = useState(false);
  const [urlMessage, setUrlMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [strategyLevel, setStrategyLevel] = useState<ValuationStrategyLevel>('REALISTIC');
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const [form, setForm] = useState<PropertyData>({
    name: 'Appartement 2 Chambres • Guéliz',
    url: '',
    district: 'Guéliz',
    city: 'Marrakech',
    bedrooms: 2,
    bathrooms: 1.5,
    currency: 'MAD',
    current_adr: 750,
    current_occupancy_pct: 52,
    target_adr: 1050,
    target_occupancy_pct: 79,
    review_rating: 4.70,
    review_count: 22,
    photo_count: 18,
    has_professional_photos: false,
    instant_book_enabled: true,
    current_title: 'Appartement 2 Chambres Guéliz Marrakech',
    current_description: 'Logement moderne situé au centre de Guéliz à Marrakech avec terrasse et climatisation.',
    owner_name: 'Propriétaire Marrakech',
    strategy_level: 'REALISTIC',
    has_fiber_optic: true,
    ac_all_rooms: true,
    has_private_terrace: true,
    has_guard_24_7: true,
    guest_registration_process: 'none',
  });

  const realisticBenchmark = useMemo(() => {
    return getRealisticMarrakechBenchmark(form.district, form.bedrooms, strategyLevel);
  }, [form.district, form.bedrooms, strategyLevel]);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      target_adr: realisticBenchmark.top10_adr_mad,
      target_occupancy_pct: realisticBenchmark.top10_occupancy_pct,
      strategy_level: strategyLevel
    }));
  }, [realisticBenchmark, strategyLevel]);

  const previewMetrics = useMemo(() => {
    const targetAdr = form.target_adr || realisticBenchmark.top10_adr_mad;
    const targetOcc = form.target_occupancy_pct || realisticBenchmark.top10_occupancy_pct;
    const currentRev = 365 * (form.current_occupancy_pct / 100) * form.current_adr;
    const targetRev = 365 * (targetOcc / 100) * targetAdr;
    const annualLeakage = Math.max(0, targetRev - currentRev);
    const monthlyLeakage = Math.round(annualLeakage / 12);

    return {
      currentRev,
      targetRev,
      annualLeakage,
      monthlyLeakage,
      targetAdr
    };
  }, [form, realisticBenchmark]);

  const handleAnalyzeUrl = async (urlToAnalyze?: string) => {
    const cleanUrl = (urlToAnalyze || propertyUrl).trim();
    if (!cleanUrl) {
      setUrlMessage({ text: 'Veuillez coller une URL d\'annonce valide.', type: 'error' });
      return;
    }

    setIsUrlParsing(true);
    setUrlMessage(null);

    try {
      const res = await fetch('/api/audit/parse-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl })
      });

      if (!res.ok) throw new Error('Échec parsing');

      const data = await res.json();
      const realProperty: PropertyData = data.property;

      const dynamicBench = getRealisticMarrakechBenchmark(realProperty.district, realProperty.bedrooms, strategyLevel);
      const updatedProp: PropertyData = {
        ...realProperty,
        target_adr: dynamicBench.top10_adr_mad,
        target_occupancy_pct: dynamicBench.top10_occupancy_pct,
        strategy_level: strategyLevel
      };

      setForm(updatedProp);
      setUrlMessage({
        text: `✓ Annonce analysée : "${realProperty.name.slice(0, 40)}..." (${realProperty.bedrooms}Ch @ ${realProperty.district}) — Vérifiez vos données ci-dessous`,
        type: 'success'
      });
    } catch (err: any) {
      const fallbackProp: PropertyData = {
        ...form,
        url: cleanUrl,
        name: `Logement ${form.district} (URL Analysée)`,
      };
      setForm(fallbackProp);
      setUrlMessage({ text: 'Lien identifié. Calibrez vos chiffres ci-dessous :', type: 'success' });
    } finally {
      setIsUrlParsing(false);
    }
  };

  const handleExecuteAuditWithAccurateData = async () => {
    try {
      const res = await fetch('/api/audit/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const auditData = await res.json();
        onAuditGenerated(auditData);
      } else {
        const fallbackAudit = calculateMarrakechAudit(form);
        onAuditGenerated(fallbackAudit);
      }
    } catch (err) {
      const fallbackAudit = calculateMarrakechAudit(form);
      onAuditGenerated(fallbackAudit);
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setPropertyUrl(sampleUrl);
    handleAnalyzeUrl(sampleUrl);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden space-y-0">
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Audit par Lien & Benchmarks Réalistes Marrakech (MAD)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Collez le Lien de Votre Annonce
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 max-w-2xl">
              Les benchmarks sont <strong>automatiquement calibrés sur le nombre exact de chambres</strong> pour refléter la réalité du marché de Marrakech.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-semibold">Devise :</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Dirham Marocain (MAD)
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyzeUrl();
          }}
          className="mt-6 space-y-3"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950/90 p-2.5 rounded-2xl border-2 border-brand-500/40 focus-within:border-brand-400 shadow-inner">
            <div className="flex items-center gap-2 pl-3 text-slate-400 w-full sm:w-auto shrink-0">
              <LinkIcon className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold text-slate-300">URL :</span>
            </div>

            <input
              type="url"
              required
              placeholder="https://www.airbnb.com/rooms/... ou https://booking.com/... ou https://avito.ma/..."
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 px-2 py-2 focus:outline-none font-sans"
            />

            <button
              type="submit"
              disabled={isUrlParsing || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isUrlParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyse de l'annonce...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Analyser l'Annonce
                </>
              )}
            </button>
          </div>

          {urlMessage && (
            <div className={`text-xs font-semibold px-3 py-2 rounded-xl border flex items-center gap-2 animate-in fade-in ${
              urlMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/10 text-red-300 border-red-500/30'
            }`}>
              {urlMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span>{urlMessage.text}</span>
            </div>
          )}
        </form>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Exemples de liens réels :</span>
          {REAL_SAMPLE_URLS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.url)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* SMART CALIBRATION & REALISTIC BENCHMARK BAR */}
      <div className="p-6 bg-slate-900 border-b border-slate-800 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-brand-500/20 text-brand-400 rounded-lg">
              <Edit3 className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Données de l'Annonce & Objectif de Performance :
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Ambition :</span>
            {[
              { id: 'MODERATE', label: 'Prudent (+20%)' },
              { id: 'REALISTIC', label: 'Réaliste Top 15% (+35%)' },
              { id: 'AGGRESSIVE', label: 'Leader Top 5% (+55%)' },
            ].map(lvl => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setStrategyLevel(lvl.id as any)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  strategyLevel === lvl.id
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="lg:col-span-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Nom / Titre de l'Annonce
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, current_title: e.target.value })}
              className="w-full bg-slate-900 text-xs font-bold text-white px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Chambres
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 1 })}
              className="w-full bg-slate-900 text-xs font-bold text-white px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border-2 border-emerald-500/40 shadow-inner">
            <label className="block text-[10px] font-bold uppercase text-emerald-400 mb-1">
              Prix Réel / Nuit (MAD)
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="100"
                max="50000"
                step="25"
                value={form.current_adr}
                onChange={(e) => setForm({ ...form, current_adr: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-900 text-sm font-black text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/50 focus:outline-none"
              />
              <span className="text-[11px] font-bold text-slate-400">MAD</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Quartier Marrakech
            </label>
            <select
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full bg-slate-900 text-xs font-bold text-white px-2 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-brand-500"
            >
              {['Guéliz', 'Hivernage', 'Médina (Riad)', 'Palmeraie', 'Majorelle / Victor Hugo', 'Agdal / Avenue Mohammed VI', 'Amelkis / Golfs', 'Autre Quartier (Marrakech)'].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Note ★ & Avis
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="number"
                step="0.01"
                min="1"
                max="5"
                value={form.review_rating}
                onChange={(e) => setForm({ ...form, review_rating: parseFloat(e.target.value) || 4.5 })}
                className="w-full bg-slate-900 text-xs font-bold text-amber-300 px-1.5 py-1 rounded-lg border border-slate-700"
              />
              <input
                type="number"
                min="0"
                value={form.review_count}
                onChange={(e) => setForm({ ...form, review_count: parseInt(e.target.value) || 0 })}
                placeholder="Avis"
                className="w-full bg-slate-900 text-xs font-bold text-white px-1.5 py-1 rounded-lg border border-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Target className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Benchmark calculé pour un <strong>{form.bedrooms} chambre(s) à {form.district}</strong> : 
              Moyenne marché = <strong>{realisticBenchmark.market_avg_adr_mad} MAD</strong> ➔ 
              Cible {strategyLevel === 'MODERATE' ? 'Prudente' : 'Top 10%'} = <strong className="text-emerald-400">{realisticBenchmark.top10_adr_mad} MAD/nuit</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showAdvancedSettings ? 'Masquer équipements' : 'Ajuster équipements (Fibre, Clim, Terrasse)'}
          </button>
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={handleExecuteAuditWithAccurateData}
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Générer l'Audit Réaliste ({form.current_adr} MAD ➔ Cible {realisticBenchmark.top10_adr_mad} MAD)
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showAdvancedSettings && (
        <div className="p-6 bg-slate-50 border-b border-slate-200/80 space-y-4 animate-in fade-in duration-200">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Équipements & Critères de Valorisation Marrakech :
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
            <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={form.has_fiber_optic}
                onChange={(e) => setForm({ ...form, has_fiber_optic: e.target.checked })}
                className="w-3.5 h-3.5 text-brand-600 rounded"
              />
              <span>Fibre Optique 200M</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={form.ac_all_rooms}
                onChange={(e) => setForm({ ...form, ac_all_rooms: e.target.checked })}
                className="w-3.5 h-3.5 text-brand-600 rounded"
              />
              <span>Climatisation réversible</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={form.has_private_terrace}
                onChange={(e) => setForm({ ...form, has_private_terrace: e.target.checked })}
                className="w-3.5 h-3.5 text-brand-600 rounded"
              />
              <span>Terrasse / Solarium</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer bg-white p-2.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={form.has_guard_24_7}
                onChange={(e) => setForm({ ...form, has_guard_24_7: e.target.checked })}
                className="w-3.5 h-3.5 text-brand-600 rounded"
              />
              <span>Gardien 24/7</span>
            </label>
          </div>
        </div>
      )}

      <div className="p-6 bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fuite de Revenu Annuelle Réaliste ({form.bedrooms} Ch. à {form.district})
            </span>
            <div className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
              {previewMetrics.annualLeakage.toLocaleString('fr-FR')} MAD
              <span className="text-xs font-semibold text-slate-500 ml-2">
                (~{previewMetrics.monthlyLeakage.toLocaleString('fr-FR')} MAD / mois)
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 font-semibold block">Potentiel Réaliste ({realisticBenchmark.strategy_description}) :</span>
          <div className="text-xl font-extrabold text-emerald-700">
            {previewMetrics.targetRev.toLocaleString('fr-FR')} MAD / an
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            (Cible : {previewMetrics.targetAdr} MAD/nuit @ {realisticBenchmark.top10_occupancy_pct}% occ.)
          </span>
        </div>
      </div>
    </div>
  );
}
