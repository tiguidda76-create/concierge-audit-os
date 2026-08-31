'use client';

import React, { useState, useMemo } from 'react';
import { Download, Sparkles, ArrowRight, CheckCircle2, AlertCircle, TrendingDown, FileText, BarChart3, Printer, Target, Edit3, Sliders, RefreshCw } from 'lucide-react';

interface AuditViewProps {
  audit: any;
  onLaunchSolutions: (auditId: string) => void;
  isSolutionLoading: boolean;
}

export default function AuditView({ audit, onLaunchSolutions, isSolutionLoading }: AuditViewProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const { property_input, breakdown, recommendations, audit_id } = audit;

  const [liveTargetAdr, setLiveTargetAdr] = useState<number>(
    property_input.target_adr || Math.round(property_input.current_adr * 1.30)
  );
  const [liveTargetOcc, setLiveTargetOcc] = useState<number>(
    property_input.target_occupancy_pct || 78
  );

  const dynamicFinancials = useMemo(() => {
    const currentAdr = property_input.current_adr;
    const currentOcc = property_input.current_occupancy_pct;
    const currency = property_input.currency || 'MAD';

    const currentAnnualRev = Math.round(365 * (currentOcc / 100) * currentAdr);
    const targetAnnualRev = Math.round(365 * (liveTargetOcc / 100) * liveTargetAdr);
    const annualLeakage = Math.max(0, targetAnnualRev - currentAnnualRev);
    const monthlyLeakage = Math.round(annualLeakage / 12);
    const dailyLeakage = Math.round(annualLeakage / 365);
    const adrGap = Math.round(liveTargetAdr - currentAdr);
    const occGap = Math.round(liveTargetOcc - currentOcc);
    const leakagePct = targetAnnualRev > 0 ? Number(((annualLeakage / targetAnnualRev) * 100).toFixed(1)) : 0;
    const growthPct = currentAdr > 0 ? Math.round(((liveTargetAdr - currentAdr) / currentAdr) * 100) : 30;

    return {
      currentAnnualRev,
      targetAnnualRev,
      annualLeakage,
      monthlyLeakage,
      dailyLeakage,
      adrGap,
      occGap,
      leakagePct,
      growthPct,
      currency
    };
  }, [property_input, liveTargetAdr, liveTargetOcc]);

  const handlePrintOrDownload = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 stroke-emerald-500';
    if (score >= 65) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Optimal':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Optimal</span>;
      case 'Good':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Bon</span>;
      case 'Warning':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Attention</span>;
      default:
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Critique</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden space-y-6 print:border-none print:shadow-none">
      <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4 print:bg-slate-900 print:text-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Audit Complet #{audit_id}
            </span>
            <span className="text-xs text-slate-400">{audit.created_at}</span>
          </div>
          <h2 className="text-2xl font-black mt-2 tracking-tight">{property_input.name}</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Marrakech ({property_input.district}) • {property_input.bedrooms} Chambres, {property_input.bathrooms} Salles de bain
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrintOrDownload}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Printer className="w-4 h-4 text-brand-400" />
            {isPrinting ? 'Préparation...' : 'Imprimer / Exporter PDF (A4)'}
          </button>

          <button
            type="button"
            onClick={() => onLaunchSolutions(audit_id)}
            disabled={isSolutionLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-white" />
            {isSolutionLoading ? 'Génération du Copywriting...' : 'Lancer l\'Agent Copywriting & Photos'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-white flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-200 block">
                Ajuster la Cible de Prix & Rendement en Direct :
              </span>
              <span className="text-[11px] text-slate-400">
                Tarif actuel : <strong>{property_input.current_adr} MAD</strong> ➔ Cible actuelle : <strong className="text-emerald-400">{liveTargetAdr} MAD/nuit</strong> ({dynamicFinancials.growthPct > 0 ? `+${dynamicFinancials.growthPct}%` : 'Cible'})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Cible MAD :</label>
              <input
                type="number"
                step="25"
                min="100"
                max="50000"
                value={liveTargetAdr}
                onChange={(e) => setLiveTargetAdr(parseFloat(e.target.value) || property_input.current_adr)}
                className="w-20 bg-slate-900 text-xs font-black text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 text-right focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1">
              {[
                { label: '+15%', factor: 1.15 },
                { label: '+25%', factor: 1.25 },
                { label: '+35%', factor: 1.35 },
                { label: '+50%', factor: 1.50 },
              ].map((btn, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setLiveTargetAdr(Math.round(property_input.current_adr * btn.factor))}
                  className="text-[10px] font-bold bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white px-2 py-1 rounded-md border border-slate-700 transition-all cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Revenu Brut Actuel (Est. 365j)</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {dynamicFinancials.currentAnnualRev.toLocaleString('fr-FR')} {dynamicFinancials.currency}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {property_input.current_occupancy_pct}% Occupation @ {property_input.current_adr} {dynamicFinancials.currency}/nuit
            </p>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Potentiel Réaliste ({property_input.district})
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {dynamicFinancials.targetAnnualRev.toLocaleString('fr-FR')} {dynamicFinancials.currency}
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              Objectif {liveTargetOcc}% Occ @ {liveTargetAdr} {dynamicFinancials.currency}/nuit (+{dynamicFinancials.growthPct}%)
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">Fuite de Revenu Réaliste Détectée</span>
              <span className="text-[11px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                -{dynamicFinancials.leakagePct}%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-1">
              {dynamicFinancials.annualLeakage.toLocaleString('fr-FR')} {dynamicFinancials.currency}
            </div>
            <p className="text-xs font-semibold text-red-700 mt-1">
              -{dynamicFinancials.monthlyLeakage.toLocaleString('fr-FR')} {dynamicFinancials.currency}/mois • -{dynamicFinancials.dailyLeakage.toLocaleString('fr-FR')} {dynamicFinancials.currency}/jour
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Score Global de l'Annonce</span>
            
            <div className="relative w-36 h-36 my-4 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`transition-all duration-1000 ease-out ${getScoreColor(breakdown.overall_score)}`}
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * breakdown.overall_score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white">{breakdown.overall_score}</span>
                <span className="text-[10px] font-bold text-slate-400">SUR 100</span>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-300 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              {breakdown.score_grade}
            </span>
            <p className="text-xs text-slate-400 mt-3">
              {audit.trigger_solution_agent
                ? 'Opportunités de croissance identifiées. Restructuration du titre et de la description recommandée.'
                : 'Logement proche des standards optimaux.'}
            </p>
          </div>

          <div className="md:col-span-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Évaluation par Piliers Algorithmiques
            </h3>

            <div className="space-y-3.5">
              {[
                breakdown.pricing_score,
                breakdown.seo_content_score,
                breakdown.visual_score,
                breakdown.reputation_score,
              ].map((cat, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                      {getStatusBadge(cat.status)}
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{cat.score}/100</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong className="text-slate-800">Diagnostic :</strong> {cat.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-100/70 px-4 py-3 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Comparatif Face aux Objectifs Réalistes de {property_input.district} (Marrakech)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Métrique de Performance</th>
                  <th className="py-3 px-4">Votre Valeur Actuelle</th>
                  <th className="py-3 px-4">Cible Réaliste ({property_input.district})</th>
                  <th className="py-3 px-4">Écart / Diagnostic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Prix Moyen par Nuit (ADR)</td>
                  <td className="py-3 px-4">{property_input.current_adr} {dynamicFinancials.currency}</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{liveTargetAdr} {dynamicFinancials.currency}</td>
                  <td className="py-3 px-4 font-bold text-red-600">-{dynamicFinancials.adrGap} {dynamicFinancials.currency}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Taux d'Occupation Annuel</td>
                  <td className="py-3 px-4">{property_input.current_occupancy_pct}%</td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{liveTargetOcc}%</td>
                  <td className="py-3 px-4 font-bold text-red-600">-{dynamicFinancials.occGap}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Note & Score Avis</td>
                  <td className="py-3 px-4">{property_input.review_rating} ★ ({property_input.review_count} avis)</td>
                  <td className="py-3 px-4">4.90 ★</td>
                  <td className="py-3 px-4">
                    {property_input.review_rating >= 4.85 ? (
                      <span className="text-emerald-600 font-semibold">Optimal</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">À Améliorer</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Nombre de Photos OTA</td>
                  <td className="py-3 px-4">{property_input.photo_count} photos</td>
                  <td className="py-3 px-4">24+ HD mises en scène</td>
                  <td className="py-3 px-4">
                    {property_input.photo_count >= 22 ? (
                      <span className="text-emerald-600 font-semibold">Suffisant</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Déficit (+{Math.max(1, 24 - property_input.photo_count)} recommandées)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Shooting Pro & Terrasse</td>
                  <td className="py-3 px-4">{property_input.has_professional_photos ? 'Pro HD' : 'Smartphone / Non calibré'}</td>
                  <td className="py-3 px-4">Pro HDR Grand Angle</td>
                  <td className="py-3 px-4">
                    {property_input.has_professional_photos ? (
                      <span className="text-emerald-600 font-semibold">Vérifié Pro</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Déficit Visuel</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Plan d'Actions Prioritaires pour Capter la Fuite de Revenu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  rec.priority === 'HIGH' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    rec.priority === 'HIGH' ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    Priorité {rec.priority} • {rec.pillar}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">{rec.impact_estimate}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1.5">{rec.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
