'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Send, Download, Copy, Check, ExternalLink, ShieldCheck, Terminal } from 'lucide-react';

interface ChannelSyncModalProps {
  auditId: string;
  selectedTitle: string;
  selectedDescription: string;
  onClose: () => void;
}

export default function ChannelSyncModal({
  auditId,
  selectedTitle,
  selectedDescription,
  onClose,
}: ChannelSyncModalProps) {
  const [channelType, setChannelType] = useState<'hostaway' | 'guesty' | 'smoobu' | 'channex'>('hostaway');
  const [listingId, setListingId] = useState(`PROP_${auditId.slice(-6).toUpperCase()}`);
  const [apiKey, setApiKey] = useState('pms_live_sandbox_key_9921');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleExecuteSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch(`/api/audit/${auditId}/sync-channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audit_id: auditId,
          channel_type: channelType,
          listing_id: listingId,
          api_key: apiKey,
          selected_title: selectedTitle,
          selected_description: selectedDescription,
        }),
      });

      if (!res.ok) throw new Error('Channel sync failed');
      const data = await res.json();
      setSyncResult(data);
    } catch (e: any) {
      alert(e.message || 'Error executing channel sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadPack = async () => {
    try {
      const res = await fetch(`/api/audit/${auditId}/onboarding-pack`);
      if (!res.ok) throw new Error('Failed to retrieve onboarding pack');
      const data = await res.json();
      
      const blob = new Blob([data.markdown_content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Onboarding_Pack_${auditId}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'Error downloading pack');
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Agent 3: Execution & Synchronizer
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1">Fulfillment & Channel Manager Sync</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border-2 border-brand-500 rounded-xl text-center">
              <Send className="w-5 h-5 text-brand-600 mx-auto mb-1" />
              <span className="text-xs font-bold text-slate-900 block">1. Direct PMS API</span>
              <span className="text-[10px] text-slate-500">Hostaway, Guesty, Smoobu</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <Copy className="w-5 h-5 text-slate-700 mx-auto mb-1" />
              <span className="text-xs font-bold text-slate-900 block">2. Clipboard Kit</span>
              <span className="text-[10px] text-slate-500">Manual Concierge Paste</span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <Download className="w-5 h-5 text-slate-700 mx-auto mb-1" />
              <span className="text-xs font-bold text-slate-900 block">3. Onboarding Pack</span>
              <span className="text-[10px] text-slate-500">Client Markdown / JSON</span>
            </div>
          </div>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Channel Manager</label>
                <select
                  value={channelType}
                  onChange={(e: any) => setChannelType(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="hostaway">Hostaway API</option>
                  <option value="guesty">Guesty Open API</option>
                  <option value="smoobu">Smoobu Channel Manager</option>
                  <option value="channex">Channex.io Multi-Calendar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PMS Listing ID</label>
                <input
                  type="text"
                  value={listingId}
                  onChange={(e) => setListingId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">API Key / Token (Sandbox Simulation Enabled)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {syncResult && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {syncResult.message}
              </div>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg text-[11px] font-mono overflow-x-auto">
                <span className="text-emerald-400 font-bold">// Dispatched API Payload</span>
                <pre className="mt-1">{JSON.stringify(syncResult.payload_dispatched, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex gap-2">
              <button
                onClick={handleDownloadPack}
                className="flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2.5 rounded-xl transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Onboarding Pack (.MD)
              </button>

              <button
                onClick={() => copyToClipboard(selectedTitle + '\n\n' + selectedDescription, 'checklist')}
                className="flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 px-3.5 py-2.5 rounded-xl transition-all"
              >
                {copiedKey === 'checklist' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'checklist' ? 'Copied!' : 'Copy Assets'}
              </button>
            </div>

            <button
              onClick={handleExecuteSync}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSyncing ? 'Dispatching Payload...' : `Push to ${channelType.toUpperCase()} API`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
