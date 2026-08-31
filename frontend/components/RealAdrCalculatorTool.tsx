'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Calendar, TrendingUp, ShieldCheck, Check, Sparkles, Building2, Tag, ChevronRight, X } from 'lucide-react';
import { MARRAKECH_DISTRICT_BENCHMARKS, calculateRealAdrBreakdown, AdrCalculatorParams } from '@/lib/marrakech_engine';

interface RealAdrCalculatorToolProps {
  initialDistrict?: string;
  initialPrice?: number;
  initialPlatform?: 'airbnb' | 'booking' | 'avito' | 'mubawab' | 'manual';
  onApplyAdrToAudit?: (realAdr: number, district: string) => void;
  onClose?: () => void;
}

export default function RealAdrCalculatorTool({
  initialDistrict = 'Guéliz',
  initialPrice = 1000,
  initialPlatform = 'airbnb',
  onApplyAdrToAudit,
  onClose
}: RealAdrCalculatorToolProps) {
  const [platform, setPlatform] = useState<'airbnb' | 'booking' | 'avito' | 'mubawab' | 'manual'>(initialPlatform);
  const [rawPrice, setRawPrice] = useState<number>(initialPrice);
  const [isMonthlyRate, setIsMonthlyRate] = useState(false);
  const [district, setDistrict] = useState(initialDistrict);
  const [bedrooms, setBedrooms] = useState(2);
  const [reviewScore, setReviewScore] = useState(4.80);

  const [hasFiberOptic, setHasFiberOptic] = useState(true);
  const [hasAcAllRooms, setHasAcAllRooms] = useState(true);
  const [hasPrivateTerrace, setHasPrivateTerrace] = useState(true);
  const [hasPrivatePool, setHasPrivatePool] = useState(false);
  const [hasGuard247, setHasGuard247] = useState(true);

  const valuation = useMemo(() => {
    const params: AdrCalculatorParams = {
      platform,
      rawDisplayedPrice: rawPrice,
      isMonthlyRate,
      district,
      bedrooms,
      hasFiberOptic,
      hasAcAllRooms,
      hasPrivateTerrace,
      hasPrivatePool,
      hasGuard247,
      reviewScore
    };
    return calculateRealAdrBreakdown(params);
  }, [platform, rawPrice, isMonthlyRate, district, bedrooms, hasFiberOptic, hasAcAllRooms, hasPrivateTerrace, hasPrivatePool, hasGuard247, reviewScore]);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/20 border border-brand-500/40 rounded-xl text-brand-400">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Gratuit • Marché Marrakech STR
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              Calculateur d'ADR Réel & Normalisation de Plateforme
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Déduisez commissions OTA, taxes locales et appliquez la saisonnalité et les primes de quartier à Marrakech.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Plateforme de l'annonce source :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'airbnb', label: 'Airbnb', fee: '~15% Voyageur' },
                { id: 'booking', label: 'Booking', fee: '~19% + TPT' },
                { id: 'avito', label: 'Avito.ma', fee: '0% Direct' },
                { id: 'mubawab', label: 'Mubawab', fee: '0% Agence' },
              ].map((p) => {
                const isSelected = platform === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-500 bg-brand-500/20 text-white shadow-md'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="block text-xs font-extrabold">{p.label}</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{p.fee}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-300">
                {isMonthlyRate ? 'Loyer Mensuel Affiché' : 'Prix Brut Affiché sur le site'}
              </label>
              <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                {rawPrice.toLocaleString('fr-FR')} {isMonthlyRate ? 'MAD / mois' : 'MAD / nuit'}
              </span>
            </div>

            <input
              type="range"
              min={isMonthlyRate ? 3000 : 200}
              max={isMonthlyRate ? 60000 : 12000}
              step={isMonthlyRate ? 500 : 50}
              value={rawPrice}
              onChange={(e) => setRawPrice(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />

            {(platform === 'avito' || platform === 'mubawab') && (
              <label className="flex items-center gap-2 text-xs text-slate-300 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMonthlyRate}
                  onChange={(e) => {
                    setIsMonthlyRate(e.target.checked);
                    if (e.target.checked && rawPrice < 3000) setRawPrice(8500);
                    if (!e.target.checked && rawPrice > 12000) setRawPrice(800);
                  }}
                  className="w-3.5 h-3.5 text-brand-500 rounded"
                />
                <span>Ce prix est un tarif au mois (convertir en équivalent courte durée STR)</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quartier Marrakech</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs font-bold bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
              >
                {Object.keys(MARRAKECH_DISTRICT_BENCHMARKS).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Chambres</label>
              <input
                type="number"
                min="1"
                max="10"
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value) || 1)}
                className="w-full text-xs font-bold bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Primes Spécifiques Marrakech :
            </span>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasFiberOptic}
                onChange={(e) => setHasFiberOptic(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-500 rounded"
              />
              <span>Fibre Optique 200M (+10%)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAcAllRooms}
                onChange={(e) => setHasAcAllRooms(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-500 rounded"
              />
              <span>Climatisation intégrale chaud/froid (+15%)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPrivateTerrace}
                onChange={(e) => setHasPrivateTerrace(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-500 rounded"
              />
              <span>Terrasse / Rooftop privatif (+18%)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPrivatePool}
                onChange={(e) => setHasPrivatePool(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-500 rounded"
              />
              <span>Piscine privée / Bassin de Riad (+40%)</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasGuard247}
                onChange={(e) => setHasGuard247(e.target.checked)}
                className="w-3.5 h-3.5 text-brand-500 rounded"
              />
              <span>Résidence sécurisée avec gardien 24/7 (+10%)</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  ADR Net Reçu par le Propriétaire (Hors Commissions)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {valuation.netOwnerDailyRateMad.toLocaleString('fr-FR')} MAD
                  <span className="text-xs font-normal text-slate-400 ml-1.5">/ nuit</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {valuation.platformCommissionPct > 0
                    ? `Déduction de ${valuation.platformCommissionPct}% commission ${valuation.platform.toUpperCase()} (-${valuation.platformCommissionDeduction} MAD)`
                    : 'Tarif direct sans déduction OTA.'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-950/80 to-slate-950 p-4 rounded-xl border border-emerald-500/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  ADR Réel Annuel Pondéré ({district})
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                  {valuation.seasonalAdr.weightedAnnualAdrMad.toLocaleString('fr-FR')} MAD
                  <span className="text-xs font-normal text-emerald-200 ml-1.5">/ nuit</span>
                </div>
                <span className="text-[11px] text-emerald-300/80 block mt-1">
                  Intègre les saisons + prime équipements (+{valuation.amenityMultipliersTotalPct}%)
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-400" />
                  Grille Tarifaire Dynamique par Saison (Marrakech) :
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Stratégie Yield</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-900/30 border border-emerald-700/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Très Haute Saison</span>
                  <span className="text-xs text-slate-400 block text-[10px] mb-1">(Oct-Mai, Fêtes, FIFM)</span>
                  <span className="text-base font-black text-white">{valuation.seasonalAdr.peakSeasonMad} MAD</span>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-900/30 border border-blue-700/40">
                  <span className="text-[10px] uppercase font-bold text-blue-400 block">Moyenne Saison</span>
                  <span className="text-xs text-slate-400 block text-[10px] mb-1">(Automne / Hiver standard)</span>
                  <span className="text-base font-black text-white">{valuation.seasonalAdr.shoulderSeasonMad} MAD</span>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-900/30 border border-amber-700/40">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block">Basse Saison</span>
                  <span className="text-xs text-slate-400 block text-[10px] mb-1">(Juillet / Août)</span>
                  <span className="text-base font-black text-white">{valuation.seasonalAdr.lowSeasonMad} MAD</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                Facteurs d'ajustement appliqués :
              </span>
              {valuation.valuationInsights.map((ins, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          {onApplyAdrToAudit && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onApplyAdrToAudit(valuation.seasonalAdr.weightedAnnualAdrMad, district)}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Appliquer cet ADR Réel ({valuation.seasonalAdr.weightedAnnualAdrMad} MAD) à l'Audit
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
