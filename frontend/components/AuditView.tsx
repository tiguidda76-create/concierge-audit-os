'use client';

import React, { useState } from 'react';
import { Download, Sparkles, ArrowRight, CheckCircle2, AlertCircle, TrendingDown, FileText, BarChart3, ExternalLink } from 'lucide-react';

interface AuditViewProps {
  audit: any;
  onLaunchSolutions: (auditId: string) => void;
  isSolutionLoading: boolean;
}

export default function AuditView({ audit, onLaunchSolutions, isSolutionLoading }: AuditViewProps) {
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const { property_input, financials, breakdown, recommendations, audit_id } = audit;

  const handleDownloadPdf = async () => {
    setIsPdfDownloading(true);
    try {
      const response = await fetch('/api/audit/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property_input),
      });

      if (!response.ok) throw new Error('PDF Generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `STR_Audit_${property_input.name.replace(/\s+/g, '_')}_${audit_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'Error generating PDF');
    } finally {
      setIsPdfDownloading(false);
    }
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
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Good</span>;
      case 'Warning':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Warning</span>;
      default:
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Critical</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden space-y-6">
      <div className="bg-slate-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Audit Complete #{audit_id}
            </span>
            <span className="text-xs text-slate-400">{audit.created_at}</span>
          </div>
          <h2 className="text-2xl font-bold mt-2 tracking-tight">{property_input.name}</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {property_input.district}, {property_input.city} • {property_input.bedrooms} Beds, {property_input.bathrooms} Baths
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isPdfDownloading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl border border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-brand-400" />
            {isPdfDownloading ? 'Rendering A4 PDF...' : 'Download 1-Page A4 PDF'}
          </button>

          <button
            onClick={() => onLaunchSolutions(audit_id)}
            disabled={isSolutionLoading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-white" />
            {isSolutionLoading ? 'Launching Solution Agent...' : 'Launch Listing Solution Agent'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Gross Revenue</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {financials.currency} {financials.current_annual_revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {property_input.current_occupancy_pct}% Occupancy @ {property_input.current_adr} {financials.currency}/night
            </p>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Top 10% Market Potential</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {financials.currency} {financials.target_annual_revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              {property_input.target_occupancy_pct || 78}% Target Occ @ {financials.currency} {property_input.target_adr || (property_input.current_adr * 1.22).toFixed(0)}/night
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">Annual Revenue Leakage</span>
              <span className="text-[11px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                -{financials.leakage_percentage}%
              </span>
            </div>
            <div className="text-2xl font-extrabold text-red-600 mt-1">
              {financials.currency} {financials.annual_revenue_leakage.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs font-semibold text-red-700 mt-1">
              -{financials.currency} {financials.monthly_revenue_leakage.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month • -{financials.currency} {financials.daily_revenue_leakage.toFixed(0)}/day
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 bg-slate-900 text-white rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Overall Audit Score</span>
            
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
                <span className="text-[10px] font-bold text-slate-400">OUT OF 100</span>
              </div>
            </div>

            <span className="text-sm font-bold text-amber-300 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              {breakdown.score_grade}
            </span>
            <p className="text-xs text-slate-400 mt-3">
              {audit.trigger_solution_agent
                ? 'Algorithmic deficits identified. Listing copy & visual restructuring required.'
                : 'Listing performing near market standards.'}
            </p>
          </div>

          <div className="md:col-span-8 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              Category Rubric Breakdown
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
                    <strong className="text-slate-800">Insight:</strong> {cat.insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-slate-100/70 px-4 py-3 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              District Benchmark Comparison
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Performance Metric</th>
                  <th className="py-3 px-4">Current Value</th>
                  <th className="py-3 px-4">Top 10% Benchmark</th>
                  <th className="py-3 px-4">Gap / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Average Daily Rate (ADR)</td>
                  <td className="py-3 px-4">{financials.currency} {property_input.current_adr}</td>
                  <td className="py-3 px-4">{financials.currency} {property_input.target_adr || (property_input.current_adr * 1.22).toFixed(1)}</td>
                  <td className="py-3 px-4 font-bold text-red-600">-{financials.currency} {financials.adr_gap}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Annual Occupancy Rate</td>
                  <td className="py-3 px-4">{property_input.current_occupancy_pct}%</td>
                  <td className="py-3 px-4">{property_input.target_occupancy_pct || 78}%</td>
                  <td className="py-3 px-4 font-bold text-red-600">-{financials.occupancy_gap}%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Review Score</td>
                  <td className="py-3 px-4">{property_input.review_rating} ★ ({property_input.review_count})</td>
                  <td className="py-3 px-4">4.92 ★</td>
                  <td className="py-3 px-4">
                    {property_input.review_rating >= 4.85 ? (
                      <span className="text-emerald-600 font-semibold">Optimal</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">Needs Review Lift</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">OTA Photo Count</td>
                  <td className="py-3 px-4">{property_input.photo_count} photos</td>
                  <td className="py-3 px-4">28+ HD staged</td>
                  <td className="py-3 px-4">
                    {property_input.photo_count >= 24 ? (
                      <span className="text-emerald-600 font-semibold">Sufficient</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Deficit ({28 - property_input.photo_count} needed)</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-900">Staging & Photography</td>
                  <td className="py-3 px-4">{property_input.has_professional_photos ? 'Pro HD' : 'Unverified / Smartphone'}</td>
                  <td className="py-3 px-4">Pro HDR Staged</td>
                  <td className="py-3 px-4">
                    {property_input.has_professional_photos ? (
                      <span className="text-emerald-600 font-semibold">Verified Pro</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Critical Deficit</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
            Algorithmic Optimization Roadmap
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
                    {rec.priority} Priority • {rec.pillar}
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
