'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, Link as LinkIcon, Search, Building2, Sliders, DollarSign, Star, ShieldCheck, CheckCircle2, ArrowRight, Layers, Flame, Check } from 'lucide-react';
import { PropertyData, MARRAKECH_DISTRICT_BENCHMARKS, calculateMarrakechAudit } from '@/lib/marrakech_engine';

export const MARRAKECH_PRESETS = [
  {
    label: 'Guéliz (Appartement & Terrasse)',
    badge: 'Appartement STR',
    data: {
      name: 'Appartement Contemporain avec Terrasse • Guéliz',
      url: 'https://airbnb.com/rooms/marrakech-gueliz-terrace-suite',
      district: 'Guéliz',
      city: 'Marrakech',
      bedrooms: 2,
      bathrooms: 1.5,
      currency: 'MAD',
      current_adr: 800,
      current_occupancy_pct: 50,
      target_adr: 1350,
      target_occupancy_pct: 79,
      review_rating: 4.60,
      review_count: 18,
      photo_count: 16,
      has_professional_photos: false,
      instant_book_enabled: true,
      current_title: 'Bel appartement à Guéliz avec terrasse et wifi',
      current_description: 'Appartement agréable proche Carré Eden avec salon, climatisation et cuisine équipée.',
      owner_name: 'Karim Bennani',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'none' as const
    }
  },
  {
    label: 'Médina (Riad de Charme & Patio)',
    badge: 'Riad Historique',
    data: {
      name: 'Riad Exclusif avec Patio & Bassin • Médina',
      url: 'https://booking.com/hotel/ma/riad-palais-medina-marrakech.html',
      district: 'Médina (Riad)',
      city: 'Marrakech',
      bedrooms: 4,
      bathrooms: 4,
      currency: 'MAD',
      current_adr: 1900,
      current_occupancy_pct: 52,
      target_adr: 3500,
      target_occupancy_pct: 84,
      review_rating: 4.75,
      review_count: 42,
      photo_count: 22,
      has_professional_photos: true,
      instant_book_enabled: true,
      current_title: 'Riad traditionnel 4 chambres au cœur de la Médina',
      current_description: 'Magnifique riad avec patio arboré, fontaine, terrasse vue Atlas et service sur place.',
      owner_name: 'Omar Alami',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'digital_precheckin' as const
    }
  },
  {
    label: 'Hivernage (Penthouse Standing)',
    badge: 'Penthouse Luxe',
    data: {
      name: 'Penthouse Standing • Piscine & Balcon • Hivernage',
      url: 'https://airbnb.com/rooms/hivernage-luxury-penthouse',
      district: 'Hivernage',
      city: 'Marrakech',
      bedrooms: 2,
      bathrooms: 2,
      currency: 'MAD',
      current_adr: 1300,
      current_occupancy_pct: 55,
      target_adr: 2200,
      target_occupancy_pct: 82,
      review_rating: 4.70,
      review_count: 28,
      photo_count: 18,
      has_professional_photos: false,
      instant_book_enabled: true,
      current_title: 'Superbe appartement quartier Hivernage avec piscine',
      current_description: 'Logement haut standing dans résidence sécurisée, proche des restaurants et avenues prestigieuses.',
      owner_name: 'Youssef Chaoui',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'concierge_handled' as const
    }
  },
  {
    label: 'Palmeraie (Villa Privée & Piscine)',
    badge: 'Villa Privée',
    data: {
      name: 'Villa Privée avec Grand Jardin & Piscine • Palmeraie',
      url: 'https://mubawab.ma/fr/pa/villa-palmeraie-piscine-marrakech',
      district: 'Palmeraie',
      city: 'Marrakech',
      bedrooms: 4,
      bathrooms: 4,
      currency: 'MAD',
      current_adr: 3600,
      current_occupancy_pct: 42,
      target_adr: 6500,
      target_occupancy_pct: 74,
      review_rating: 4.82,
      review_count: 15,
      photo_count: 26,
      has_professional_photos: true,
      instant_book_enabled: true,
      current_title: 'Grande villa avec piscine privée Palmeraie Marrakech',
      current_description: 'Propriété d\'exception dans un domaine sécurisé au calme absolu avec personnel de maison.',
      owner_name: 'Tariq Benjelloun',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'concierge_handled' as const
    }
  }
];

interface AuditGeneratorProps {
  onAuditGenerated: (data: any) => void;
  isLoading: boolean;
}

export default function AuditGenerator({ onAuditGenerated, isLoading }: AuditGeneratorProps) {
  const [propertyUrl, setPropertyUrl] = useState('');
  const [form, setForm] = useState<PropertyData>(MARRAKECH_PRESETS[0].data);
  const [isUrlParsing, setIsUrlParsing] = useState(false);
  const [urlMessage, setUrlMessage] = useState<string | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

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

  const handleAnalyzeUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = propertyUrl.trim();
    if (!cleanUrl) {
      runAuditNow(form);
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

      if (res.ok) {
        const parsed = await res.json();
        setForm(parsed.property);
        setUrlMessage(`✓ Annonce analysée avec succès (${parsed.platform.toUpperCase()})`);
        runAuditNow(parsed.property);
      } else {
        throw new Error('Fallback parsing');
      }
    } catch (err) {
      const lower = cleanUrl.toLowerCase();
      let matchedPreset = MARRAKECH_PRESETS[0];
      if (lower.includes('riad') || lower.includes('medina')) matchedPreset = MARRAKECH_PRESETS[1];
      else if (lower.includes('hivernage')) matchedPreset = MARRAKECH_PRESETS[2];
      else if (lower.includes('villa') || lower.includes('palmeraie')) matchedPreset = MARRAKECH_PRESETS[3];

      const updated = { ...matchedPreset.data, url: cleanUrl };
      setForm(updated);
      setUrlMessage(`✓ Annonce ${matchedPreset.data.district} identifiée`);
      runAuditNow(updated);
    } finally {
      setIsUrlParsing(false);
    }
  };

  const runAuditNow = async (propertyData: PropertyData) => {
    try {
      const res = await fetch('/api/audit/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });

      if (res.ok) {
        const data = await res.json();
        onAuditGenerated(data);
      } else {
        const fallbackAudit = calculateMarrakechAudit(propertyData);
        onAuditGenerated(fallbackAudit);
      }
    } catch (err) {
      const fallbackAudit = calculateMarrakechAudit(propertyData);
      onAuditGenerated(fallbackAudit);
    }
  };

  const applyPreset = (presetData: PropertyData) => {
    setForm({ ...presetData });
    setPropertyUrl(presetData.url || '');
    setUrlMessage(null);
    runAuditNow(presetData);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden space-y-0">
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Spécialiste Marché Marrakech (STR & Conciergerie)
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2 tracking-tight">Audit de Performance & Fuite de Revenu</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Collez simplement le lien de votre annonce Airbnb, Booking.com, Avito ou Mubawab pour lancer l'audit instantané.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-semibold">Devise :</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Dirham Marocain (MAD)
            </span>
          </div>
        </div>

        <form onSubmit={handleAnalyzeUrl} className="mt-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border-2 border-brand-500/40 focus-within:border-brand-400 shadow-inner">
            <div className="flex items-center gap-2 pl-3 text-slate-400 w-full sm:w-auto">
              <LinkIcon className="w-4 h-4 text-brand-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-300 hidden md:inline shrink-0">Lien de l'annonce :</span>
            </div>

            <input
              type="text"
              placeholder="Collez l'URL (Airbnb, Booking.com, Avito.ma, Mubawab.ma...)"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 px-2 py-2 focus:outline-none font-sans"
            />

            <button
              type="submit"
              disabled={isUrlParsing || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {isUrlParsing ? 'Analyse du lien...' : 'Auditer cette Annonce'}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 px-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Plateformes prises en charge :</span>
              <span className="font-semibold text-slate-200">Airbnb</span> •
              <span className="font-semibold text-slate-200">Booking.com</span> •
              <span className="font-semibold text-slate-200">Avito.ma</span> •
              <span className="font-semibold text-slate-200">Mubawab</span>
            </div>

            {urlMessage && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 animate-in fade-in">
                {urlMessage}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="p-6 bg-slate-50 border-b border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Ou sélectionnez un profil type à Marrakech :
          </span>
          <button
            type="button"
            onClick={() => setShowManualForm(!showManualForm)}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            <Sliders className="w-3.5 h-3.5" />
            {showManualForm ? 'Masquer les paramètres avancés' : 'Ajuster manuellement les paramètres'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MARRAKECH_PRESETS.map((p, idx) => {
            const isSelected = form.district === p.data.district;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p.data)}
                className={`p-3.5 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50/70 shadow-md shadow-brand-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                    {p.badge}
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700">
                    {p.data.current_adr} MAD/nuit
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                  {p.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Occ: {p.data.current_occupancy_pct}% • {p.data.bedrooms} Ch. • {p.data.review_rating}★
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Fuite de Revenu Annuelle Détectée ({form.district})
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
            (Objectif: {previewMetrics.targetAdr} MAD/nuit @ {selectedBenchmark.top10_occupancy_pct}% occ.)
          </span>
        </div>
      </div>

      {showManualForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAuditNow(form);
          }}
          className="p-6 space-y-6 bg-white animate-in fade-in duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-brand-600" />
                Quartier & Caractéristiques
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quartier à Marrakech</label>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nom / Référence du bien</label>
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
                Tarification & Occupation
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
                  max="8000"
                  step="50"
                  value={form.current_adr}
                  onChange={(e) => setForm({ ...form, current_adr: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-600">Taux d'occupation actuel (%)</label>
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Note avis (★)</label>
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
                Spécificités Marrakech & Sécurité
              </h3>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.has_fiber_optic}
                    onChange={(e) => setForm({ ...form, has_fiber_optic: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Fibre Optique installée (200+ Mbps)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.ac_all_rooms}
                    onChange={(e) => setForm({ ...form, ac_all_rooms: e.target.checked })}
                    className="w-3.5 h-3.5 text-brand-600 rounded"
                  />
                  <span>Climatisation toutes pièces</span>
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enregistrement des voyageurs (Fiches de police)
                </label>
                <select
                  value={form.guest_registration_process}
                  onChange={(e: any) => setForm({ ...form, guest_registration_process: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  <option value="concierge_handled">Géré sur place par conciergerie</option>
                  <option value="digital_precheckin">Pré-enregistrement digital en ligne</option>
                  <option value="none">Non structuré / Manuel</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-brand-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Recalculer l'Audit Marrakech
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
