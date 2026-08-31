'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, X, Send, Copy, Check, Sparkles, Phone, Mail, UserCheck, ShieldCheck, ExternalLink } from 'lucide-react';
import { generateOwnerWhatsAppPitch } from '@/lib/marrakech_engine';

interface OwnerCloserDrawerProps {
  audit: any;
  onClose: () => void;
}

export default function OwnerCloserDrawer({ audit, onClose }: OwnerCloserDrawerProps) {
  const [conciergeName, setConciergeName] = useState('Conciergerie Marrakech Prestige');
  const [commissionRate, setCommissionRate] = useState(20);
  const [activeTab, setActiveTab] = useState<'whatsapp_fr' | 'whatsapp_darija' | 'email'>('whatsapp_fr');
  const [copied, setCopied] = useState(false);

  const pitches = useMemo(() => {
    return generateOwnerWhatsAppPitch(audit, conciergeName, commissionRate);
  }, [audit, conciergeName, commissionRate]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentContent = activeTab === 'whatsapp_fr'
    ? pitches.whatsapp_fr
    : (activeTab === 'whatsapp_darija' ? pitches.whatsapp_darija : pitches.email_pitch);

  const currentWaUrl = activeTab === 'whatsapp_darija' ? pitches.encoded_whatsapp_url_darija : pitches.encoded_whatsapp_url_fr;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Agent 05 • Mandate Closer
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight mt-1">
                Générateur de Pitch WhatsApp & Signature de Mandat
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Customization Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Nom de Votre Conciergerie
              </label>
              <input
                type="text"
                value={conciergeName}
                onChange={(e) => setConciergeName(e.target.value)}
                className="w-full bg-slate-900 text-xs font-bold text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Votre Taux de Commission (%)
              </label>
              <input
                type="number"
                min="10"
                max="40"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseInt(e.target.value) || 20)}
                className="w-full bg-slate-900 text-xs font-bold text-emerald-400 px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            {[
              { id: 'whatsapp_fr', label: 'WhatsApp (Français)' },
              { id: 'whatsapp_darija', label: 'WhatsApp (Darija Marocaine)' },
              { id: 'email', label: 'Email Formel' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Message Preview Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-900">
              <span className="text-[10px] font-bold uppercase text-slate-400">
                Aperçu du message personnalisé :
              </span>
              <button
                type="button"
                onClick={() => handleCopy(currentContent)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier le texte'}
              </button>
            </div>

            <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
              {currentContent}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-400">
            Prêt à envoyer directement au propriétaire du bien.
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCopy(currentContent)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copié !' : 'Copier'}
            </button>

            {activeTab !== 'email' && (
              <a
                href={currentWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Ouvrir dans WhatsApp
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
