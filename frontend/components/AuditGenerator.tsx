'use client';

import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Building2, Sliders, DollarSign, Camera, Star, Wifi, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export interface PropertyFormData {
  name: string;
  district: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  currency: string;
  current_adr: number;
  current_occupancy_pct: number;
  target_adr?: number;
  target_occupancy_pct?: number;
  review_rating: number;
  review_count: number;
  photo_count: number;
  has_professional_photos: boolean;
  instant_book_enabled: boolean;
  current_title: string;
  current_description: string;
  owner_name: string;
  
  has_fiber_optic: boolean;
  ac_all_rooms: boolean;
  has_private_terrace: boolean;
  has_guard_24_7: boolean;
  guest_registration_process: 'concierge_handled' | 'digital_precheckin' | 'none';
}

interface AuditGeneratorProps {
  onAuditGenerated: (data: any) => void;
  isLoading: boolean;
}

export const PRESETS = [
  {
    label: 'Marrakech Guéliz (Terrasse & Fibre)',
    data: {
      name: 'Modern Moroccan Residence w/ Sun Terrace',
      district: 'Guéliz',
      city: 'Marrakech',
      bedrooms: 2,
      bathrooms: 1.5,
      currency: 'MAD',
      current_adr: 800,
      current_occupancy_pct: 50,
      target_adr: 1300,
      target_occupancy_pct: 78,
      review_rating: 4.60,
      review_count: 18,
      photo_count: 16,
      has_professional_photos: false,
      instant_book_enabled: true,
      current_title: 'Appartement sympa au centre de Gueliz',
      current_description: 'Bel appartement a Gueliz avec terrasse et wifi.',
      owner_name: 'Karim Bennani',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'none' as const
    }
  },
  {
    label: 'Casablanca Gauthier (Business Executive)',
    data: {
      name: 'Gauthier Executive Loft • High-Speed Fiber',
      district: 'Gauthier',
      city: 'Casablanca',
      bedrooms: 1,
      bathrooms: 1,
      currency: 'MAD',
      current_adr: 950,
      current_occupancy_pct: 58,
      target_adr: 1450,
      target_occupancy_pct: 82,
      review_rating: 4.72,
      review_count: 32,
      photo_count: 18,
      has_professional_photos: true,
      instant_book_enabled: true,
      current_title: 'Studio moderne quartier Gauthier',
      current_description: 'Studio bien situé proche des restaurants et commerces.',
      owner_name: 'Mehdi Tazi',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: false,
      has_guard_24_7: true,
      guest_registration_process: 'digital_precheckin' as const
    }
  },
  {
    label: 'Tanger Malabata (Sea View)',
    data: {
      name: 'Malabata Bay Panorama • Frontline Terrace',
      district: 'Malabata',
      city: 'Tanger',
      bedrooms: 3,
      bathrooms: 2,
      currency: 'MAD',
      current_adr: 1200,
      current_occupancy_pct: 45,
      target_adr: 2100,
      target_occupancy_pct: 75,
      review_rating: 4.65,
      review_count: 22,
      photo_count: 20,
      has_professional_photos: false,
      instant_book_enabled: true,
      current_title: 'Grand appartement vue sur mer Tanger',
      current_description: 'Appartement spacieux avec vue dégagée sur la baie.',
      owner_name: 'Yassine Berrada',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'concierge_handled' as const
    }
  },
  {
    label: 'Taghazout Bay (Surf & Remote Work)',
    data: {
      name: 'Taghazout Sunset Surf Villa • Ocean View',
      district: 'Taghazout Village',
      city: 'Taghazout / Agadir',
      bedrooms: 2,
      bathrooms: 2,
      currency: 'MAD',
      current_adr: 1100,
      current_occupancy_pct: 60,
      target_adr: 1800,
      target_occupancy_pct: 85,
      review_rating: 4.88,
      review_count: 54,
      photo_count: 24,
      has_professional_photos: true,
      instant_book_enabled: true,
      current_title: 'Surf villa with rooftop ocean view',
      current_description: 'Great place for digital nomads and surfers in Taghazout.',
      owner_name: 'Amine El Fassi',
      has_fiber_optic: true,
      ac_all_rooms: false,
      has_private_terrace: true,
      has_guard_24_7: false,
      guest_registration_process: 'digital_precheckin' as const
    }
  }
];

export default function AuditGenerator({ onAuditGenerated, isLoading }: AuditGeneratorProps) {
  const [form, setForm] = useState<PropertyFormData>(PRESETS[0].data);

  const previewMetrics = useMemo(() => {
    const targetAdr = form.target_adr || form.current_adr * 1.35;
    const targetOcc = form.target_occupancy_pct || 78;
    const currentRev = 365 * (form.current_occupancy_pct / 100) * form.current_adr;
    const targetRev = 365 * (targetOcc / 100) * targetAdr;
    const annualLeakage = Math.max(0, targetRev - currentRev);
    const monthlyLeakage = annualLeakage / 12;

    return {
      currentRev,
      targetRev,
      annualLeakage,
      monthlyLeakage,
      targetAdr
    };
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/audit/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Audit calculation failed');
      const data = await res.json();
      onAuditGenerated(data);
    } catch (err: any) {
      alert(err.message || 'Error running audit pipeline');
    }
  };

  const applyPreset = (presetData: PropertyFormData) => {
    setForm({ ...presetData });
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden">
      <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-brand-500/20 text-brand-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-brand-500/30">
                Agent 1: Quantitative STR Auditor
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-2 tracking-tight">Audit de Performance & Optimisation Revenu STR</h2>
            <p className="text-slate-400 text-sm mt-1">
              Analyse quantitative du potentiel de votre bien face aux top 10% du marché marocain et calcul de la fuite de revenu.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-medium mr-1">Exemples Marché :</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p.data)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-3 py-1.5 rounded-lg transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-emerald-50 border border-red-200/60 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fuite de Revenu Annuelle Estimée</span>
              <div className="text-2xl font-extrabold text-red-600 tracking-tight">
                {form.currency} {previewMetrics.annualLeakage.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  (~{form.currency} {previewMetrics.monthlyLeakage.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} / mois)
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Potentiel Top 10% :</span>
            <div className="text-lg font-bold text-emerald-700">
              {form.currency} {previewMetrics.targetRev.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} / an
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-600" />
              1. Localisation & Bien
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nom du logement / Référence</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                >
                  <option>Marrakech</option>
                  <option>Casablanca</option>
                  <option>Tanger</option>
                  <option>Taghazout / Agadir</option>
                  <option>Rabat</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Quartier</label>
                <input
                  type="text"
                  placeholder="Ex: Guéliz, Hivernage, Médina"
                  required
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Devise</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-bold text-slate-800"
                >
                  <option value="MAD">MAD (DH)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-1 border-r border-slate-100 pr-0 md:pr-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              2. Métriques Tarifaires
            </h3>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600">Prix moyen par nuit actuel (ADR)</label>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{form.current_adr} {form.currency}</span>
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
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{form.current_occupancy_pct}%</span>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Prix Cible ({form.currency})</label>
                <input
                  type="number"
                  placeholder="Auto (Top 10%)"
                  value={form.target_adr || ''}
                  onChange={(e) => setForm({ ...form, target_adr: parseFloat(e.target.value) || undefined })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Taux Occ. Cible %</label>
                <input
                  type="number"
                  value={form.target_occupancy_pct || 78}
                  onChange={(e) => setForm({ ...form, target_occupancy_pct: parseFloat(e.target.value) || 78 })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              3. Équipements Clés & Conformité
            </h3>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-2">Équipements Climat & Réseau</label>
              <div className="grid grid-cols-1 gap-2 text-xs text-slate-700">
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
                <option value="concierge_handled">Géré sur place à l'arrivée</option>
                <option value="digital_precheckin">Pré-enregistrement digital en ligne</option>
                <option value="none">Non structuré / Manuel</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Note actuelle (★)</label>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total avis</label>
                <input
                  type="number"
                  value={form.review_count}
                  onChange={(e) => setForm({ ...form, review_count: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Titre OTA Actuel (à auditer & restructurer)</label>
            <input
              type="text"
              value={form.current_title}
              onChange={(e) => setForm({ ...form, current_title: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Description Actuelle (Extrait)</label>
            <input
              type="text"
              value={form.current_description}
              onChange={(e) => setForm({ ...form, current_description: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? 'Calcul de l\'audit en cours...' : 'Lancer l\'Audit Quantitatif & Benchmark'}
          </button>
        </div>
      </form>
    </div>
  );
}
