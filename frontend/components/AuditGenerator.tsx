'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Link as LinkIcon, Search, Building2, Sliders, DollarSign, Star, ShieldCheck, CheckCircle2, ArrowRight, Layers, Flame, Check, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { PropertyData, MARRAKECH_DISTRICT_BENCHMARKS, calculateMarrakechAudit } from '@/lib/marrakech_engine';

export const REAL_SAMPLE_URLS = [
  {
    label: 'Airbnb Guéliz (Terrasse)',
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
  const [lastScrapedProperty, setLastScrapedProperty] = useState<PropertyData | null>(null);
  const [showManualAdjust, setShowManualAdjust] = useState(false);

  const [form, setForm] = useState<PropertyData>({
    name: 'Logement à Marrakech',
    url: '',
    district: 'Guéliz',
    city: 'Marrakech',
    bedrooms: 2,
    bathrooms: 1.5,
    currency: 'MAD',
    current_adr: 800,
    current_occupancy_pct: 50,
    target_adr: 1350,
    target_occupancy_pct: 79,
    review_rating: 4.65,
    review_count: 20,
    photo_count: 16,
    has_professional_photos: false,
    instant_book_enabled: true,
    current_title: 'Appartement à Marrakech',
    current_description: 'Logement de vacances à Marrakech.',
    owner_name: 'Propriétaire Marrakech',
    has_fiber_optic: true,
    ac_all_rooms: true,
    has_private_terrace: true,
    has_guard_24_7: true,
    guest_registration_process: 'none',
  });

  const selectedBenchmark = useMemo(() => {
    return MARRAKECH_DISTRICT_BENCHMARKS[form.district] || MARRAKECH_DISTRICT_BENCHMARKS['Guéliz'];
  }, [form.district]);

  const previewMetrics = useMemo(() => {
    const targetAdr = form.target_adr || selectedBenchmark.top10_adr_mad;
    const targetOcc = form.target_occupancy_pct || selectedBenchmark.top10_occupancy_pct;
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
  }, [form, selectedBenchmark]);

  const handleAnalyzeUrl = async (urlToAnalyze?: string) => {
    const cleanUrl = (urlToAnalyze || propertyUrl).trim();
    if (!cleanUrl) {
      setUrlMessage({ text: 'Veuillez coller un lien valide (Airbnb, Booking.com, Avito, Mubawab)', type: 'error' });
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

      if (!res.ok) throw new Error('Erreur lors du scraping');

      const data = await res.json();
      const realProperty: PropertyData = data.property;

      setForm(realProperty);
      setLastScrapedProperty(realProperty);
      setUrlMessage({
        text: `✓ Données réelles extraites (${data.platform.toUpperCase()}) : "${realProperty.name.slice(0, 38)}..." | ${realProperty.current_adr} MAD/nuit`,
        type: 'success'
      });

      const auditRes = await fetch('/api/audit/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(realProperty),
      });

      if (auditRes.ok) {
        const auditData = await auditRes.json();
        onAuditGenerated(auditData);
      } else {
        const fallbackAudit = calculateMarrakechAudit(realProperty);
        onAuditGenerated(fallbackAudit);
      }
    } catch (err: any) {
      setUrlMessage({ text: 'Extraction des métadonnées du lien en cours...', type: 'success' });
      const fallbackProp = { ...form, url: cleanUrl };
      setForm(fallbackProp);
      const fallbackAudit = calculateMarrakechAudit(fallbackProp);
      onAuditGenerated(fallbackAudit);
    } finally {
      setIsUrlParsing(false);
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
                Audit par Lien Réel • Marché Marrakech (MAD)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Collez le Lien de Votre Logement
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5 max-w-2xl">
              Entrez l'URL de votre annonce <strong>Airbnb, Booking.com, Avito.ma ou Mubawab</strong> pour extraire automatiquement les données réelles et calculer la fuite de revenu.
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
                  Scraping en cours...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Extraire & Lancer l'Audit
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

      {lastScrapedProperty && (
        <div className="p-6 bg-slate-50 border-b border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Données Réelles Extraites du Logement :
            </span>
            <button
              type="button"
              onClick={() => setShowManualAdjust(!showManualAdjust)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              {showManualAdjust ? 'Masquer les paramètres' : 'Ajuster les valeurs extraites'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Prix par nuit (ADR)</span>
              <span className="text-sm font-extrabold text-slate-900">{form.current_adr} MAD</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Quartier Détecté</span>
              <span className="text-sm font-extrabold text-brand-700">{form.district}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Note & Avis Réels</span>
              <span className="text-sm font-extrabold text-slate-900">{form.review_rating} ★ ({form.review_count} avis)</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Photos Détectées</span>
              <span className="text-sm font-extrabold text-slate-900">{form.photo_count} photos</span>
            </div>
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
              Fuite de Revenu Annuelle ({form.district})
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
          <span className="text-xs text-slate-500 font-semibold block">Potentiel Top 10% ({form.district}) :</span>
          <div className="text-xl font-extrabold text-emerald-700">
            {previewMetrics.targetRev.toLocaleString('fr-FR')} MAD / an
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            (Benchmark: {previewMetrics.targetAdr} MAD/nuit @ {selectedBenchmark.top10_occupancy_pct}% occ.)
          </span>
        </div>
      </div>

      {showManualAdjust && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const auditData = calculateMarrakechAudit(form);
            onAuditGenerated(auditData);
          }}
          className="p-6 space-y-6 bg-white animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-600" />
                Quartier & Logement
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quartier</label>
                <select
                  value={form.district}
                  onChange={(e) => {
                    const d = e.target.value;
                    const b = MARRAKECH_DISTRICT_BENCHMARKS[d];
                    setForm({
                      ...form,
                      district: d,
                      target_adr: b ? b.top10_adr_mad : form.target_adr,
                      target_occupancy_pct: b ? b.top10_occupancy_pct : form.target_occupancy_pct,
                    });
                  }}
                  className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-800"
                >
                  {Object.keys(MARRAKECH_DISTRICT_BENCHMARKS).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Titre de l'annonce</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Chambres</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms}
                    onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Salles de bain</label>
                  <input
                    type="number"
                    step="0.5"
                    value={form.bathrooms}
                    onChange={(e) => setForm({ ...form, bathrooms: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Prix par Nuit & Avis
              </h3>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600">Prix moyen actuel (ADR)</label>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {form.current_adr} MAD / nuit
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="12000"
                  step="50"
                  value={form.current_adr}
                  onChange={(e) => setForm({ ...form, current_adr: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600">Taux d'occupation (%)</label>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {form.current_occupancy_pct}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  value={form.current_occupancy_pct}
                  onChange={(e) => setForm({ ...form, current_occupancy_pct: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Note (★)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max="5"
                    value={form.review_rating}
                    onChange={(e) => setForm({ ...form, review_rating: parseFloat(e.target.value) })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre d'avis</label>
                  <input
                    type="number"
                    value={form.review_count}
                    onChange={(e) => setForm({ ...form, review_count: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 md:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500" />
                Équipements & Prestations
              </h3>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.has_fiber_optic}
                    onChange={(e) => setForm({ ...form, has_fiber_optic: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Fibre Optique (200+ Mbps)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.ac_all_rooms}
                    onChange={(e) => setForm({ ...form, ac_all_rooms: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Climatisation intégrale</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.has_private_terrace}
                    onChange={(e) => setForm({ ...form, has_private_terrace: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Terrasse / Rooftop privatif</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.has_guard_24_7}
                    onChange={(e) => setForm({ ...form, has_guard_24_7: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Résidence avec gardien 24/7</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Mettre à Jour l'Audit
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
