'use client';

import React, { useState } from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, ChevronRight, BarChart3, Globe, Bot, PhoneCall, Copy, Check, MessageSquare, Shield, DollarSign, Calendar, Layers } from 'lucide-react';

interface PlaybookModalProps {
  onClose: () => void;
}

export default function PlaybookModal({ onClose }: PlaybookModalProps) {
  const [activeTab, setActiveTab] = useState<'methodology' | 'platforms' | 'ai_team' | 'scripts'>('methodology');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/20 border border-brand-500/40 rounded-xl text-brand-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Playbook & Guide Conciergerie OS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Édition Marrakech v2.4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Manuel d'Exploitation, Mathématiques & Vente de Mandats
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950 px-6 border-b border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
          {[
            { id: 'methodology', label: '1. Méthode & Calculs Mathématiques', icon: BarChart3 },
            { id: 'platforms', label: '2. Normalisation Plateformes (Airbnb/Booking/Avito)', icon: Globe },
            { id: 'ai_team', label: '3. Architecture des 5 Agents IA & Multi-PMS', icon: Bot },
            { id: 'scripts', label: '4. Scripts de Vente & Signature Mandat (20-25%)', icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed">
          {/* TAB 1: METHODOLOGY */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Comment est calculée la Fuite de Revenu Annuelle ?
                </h3>
                <p>
                  La fuite de revenu représente l'écart financier direct entre ce que rapporte actuellement le logement et ce qu'il générerait s'il était géré aux standards optimaux de conciergerie (*Top 10% de son quartier et de son nombre de chambres à Marrakech*).
                </p>
                
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 space-y-1">
                  <div>Revenu Actuel = 365j × (Taux d'Occupation Actuel) × ADR Actuel (MAD)</div>
                  <div>Revenu Cible = 365j × (Taux d'Occupation Cible Top 10%) × ADR Cible (MAD)</div>
                  <div className="text-white font-bold pt-1 border-t border-slate-800">
                    Fuite Annuelle = max(0, Revenu Cible - Revenu Actuel)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-brand-400 tracking-wider">
                    Piliers de Notation Algorithmique (Score sur 100) :
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• <strong>Tarification & Yield (30%)</strong> : Écart d'ADR et de calendrier face aux saisons de Marrakech.</li>
                    <li>• <strong>SEO & Copywriting (25%)</strong> : Mots-clés haute conversion, longueur du titre mobile et structure en 4 blocs.</li>
                    <li>• <strong>Merchandising Visuel (25%)</strong> : Séquence des 5 photos Héro et qualité HDR grand angle.</li>
                    <li>• <strong>Confiance & Réputation (20%)</strong> : Régularité de note au-dessus de 4.85★ et avis voyageurs.</li>
                  </ul>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">
                    Niveaux de Stratégie & Ambition :
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li>• <strong>Prudent (+20%)</strong> : Objectif conservateur adapté aux propriétaires hésitants.</li>
                    <li>• <strong>Réaliste Top 15% (+35%)</strong> : Le standard optimal de rentabilité recommandé.</li>
                    <li>• <strong>Leader Top 5% (+55%)</strong> : Pour les Riads et villas d'exception avec prestations luxe.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLATFORMS NORMALIZATION */}
          {activeTab === 'platforms' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-brand-400" />
                  Guide des Commissions & Différences entre Plateformes
                </h3>
                <p className="text-xs text-slate-400">
                  Chaque plateforme affiche des prix avec des structures de frais différentes. Notre moteur de normalisation rétablit l'ADR net réel :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Airbnb.com</span>
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">Frais ~15%</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Le prix affiché au voyageur inclut les frais de service voyageur (14-16%). L'hôte reçoit le prix brut moins 3% de frais d'hôte. Notre moteur déduit ces frais pour calculer l'ADR Net Propriétaire.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Booking.com</span>
                    <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Commission ~19% + TPT</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Booking facture 18% à 20% de commission sur le tarif TTC. Au Maroc, la Taxe de Promotion Touristique (TPT ~25-30 MAD/personne/nuit) est souvent ajoutée au tarif client.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Avito.ma</span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Direct 0% OTA</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Tarifs de contact direct sans commission OTA intermédiaire. Si l'annonce est au mois (longue durée), le moteur applique la formule de conversion STR court séjour : `(Loyer × 1.55) / 30`.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Mubawab.ma</span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Agence & Particulier</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Locations meublées et résidences haut standing. Normalisation automatique des surfaces et du standing de résidence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI TEAM ARCHITECTURE & MULTI-PMS DEEP DIVE */}
          {activeTab === 'ai_team' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  L'Équipe Autonome des 5 Agents IA Conciergerie
                </h3>
                <p className="text-xs text-slate-400">
                  Chaque agent est hyperspécialisé dans une étape critique de la chaîne de valeur :
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: 'Agent 1',
                    name: 'Revenue & Market Auditor',
                    role: 'Extraction d\'annonces, détection du quartier et calcul quantitatif de la fuite de revenus.',
                    tech: 'Deep State Parser & Normalisateur Marrakech'
                  },
                  {
                    num: 'Agent 2',
                    name: 'Direct-Response Copywriter & Visual Director',
                    role: 'Génération de 3 variantes de titres A/B à fort CTR, rédaction des 4 blocs immersifs et curation des 5 photos Héro.',
                    tech: 'Framework Direct-Response STR'
                  },
                  {
                    num: 'Agent 3',
                    name: 'PMS Channel Manager Integrator',
                    role: 'Exportation et synchronisation des flux vers Hostaway, Guesty, Smoobu et Channex.',
                    tech: 'Open-API Multi-PMS Adapters'
                  },
                  {
                    num: 'Agent 4',
                    name: 'Marrakech Event Radar & Seasonality Specialist',
                    role: 'Surveillance des événements de pointe (FIFM, Nouvel An, Pâques, Marathon) et ajustement des multiplicateurs de surcote (+35% à +85%).',
                    tech: 'Dynamic Yield Rules'
                  },
                  {
                    num: 'Agent 5',
                    name: 'AI Owner Pitch & Mandate Closer',
                    role: 'Génération automatique de messages WhatsApp en Français/Darija et emails de closing pour faire signer le propriétaire en mandat exclusif.',
                    tech: 'Conversion Pitch Generator'
                  },
                ].map((ag, idx) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-extrabold text-xs shrink-0 border border-brand-500/30">
                      0{idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-sm">{ag.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {ag.tech}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{ag.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DETAILED PMS INTEGRATION GUIDE */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 mt-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Guide Détaillé : Synchronisation Multi-PMS (Hostaway, Guesty, Smoobu, Channex)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Open-API Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hostaway */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs text-brand-300">1. Hostaway API</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">REST v1</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Étapes de connexion :</strong>
                      <br />1. Récupérez votre <code>Account ID</code> et <code>API Secret</code> dans <em>Hostaway &gt; Settings &gt; Hostaway API</em>.
                      <br />2. L'Agent 3 envoie une requête <code>PUT /v1/listings/{'{listingId}'}</code> avec le nouveau titre, la description en 4 blocs et la grille tarifaire calibrée.
                      <br />3. Hostaway répercute instantanément le contenu sur Airbnb, Booking.com et VRBO.
                    </p>
                  </div>

                  {/* Guesty */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs text-emerald-300">2. Guesty Open API</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Open-API</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Étapes de connexion :</strong>
                      <br />1. Générez un <code>Bearer Token</code> dans <em>Guesty &gt; Integrations &gt; Open API</em>.
                      <br />2. L'Agent 3 synchronise via <code>PUT /v1/listings/{'{id}'}</code> en mettant à jour les champs <code>title</code>, <code>publicDescription.summary</code> et <code>publicDescription.space</code>.
                      <br />3. Vos multi-calendriers et grilles tarifaires de Marrakech sont synchronisés en direct.
                    </p>
                  </div>

                  {/* Smoobu */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs text-amber-300">3. Smoobu Channel Manager</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">API Key</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Étapes de connexion :</strong>
                      <br />1. Allez dans <em>Paramètres &gt; Pour les développeurs &gt; Clé API</em>.
                      <br />2. L'Agent 3 met à jour les informations du logement via <code>POST /api/apartments/{'{id}'}</code>.
                      <br />3. Les disponibilités et règles de séjour minimum (ex: 2 nuits le week-end) sont immédiatement verrouillées.
                    </p>
                  </div>

                  {/* Channex */}
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs text-blue-300">4. Channex.io (Direct Engine)</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Channel Engine</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Étapes de connexion :</strong>
                      <br />1. Obtenez votre <code>API Key</code> et votre <code>Property ID</code> sur le dashboard Channex.
                      <br />2. L'Agent 3 synchronise la passerelle via <code>POST /api/v1/properties/{'{id}'}/content</code>.
                      <br />3. Diffusion directe vers Airbnb, Booking, Agoda, Expedia et moteurs de réservation directe.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Sécurité des Flux :</strong> Toutes les synchronisations sont protégées par chiffrement HTTPS et validation HITL (Human-in-the-Loop) obligatoire par le gestionnaire.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOSING SCRIPTS */}
          {activeTab === 'scripts' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-emerald-400" />
                  Scripts de Vente pour Signer des Mandats à 20-25%
                </h3>
                <p className="text-xs text-slate-400">
                  Copiez ces scripts éprouvés pour contacter les propriétaires d'annonces sous-performantes à Marrakech :
                </p>
              </div>

              {/* Script 1: Cold Call 30s */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                    Script 1 : Appel Téléphonique Direct (30 Secondes)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`"Bonjour [Nom Propriétaire], je suis [Votre Prénom] de la conciergerie [Nom Conciergerie] à Marrakech.\n\nJe vous contacte au sujet de votre bien à [Quartier]. Nous venons d'auditer les annonces du secteur et votre logement a un potentiel exceptionnel mais subit actuellement une sous-tarification par rapport au Top 10% du quartier.\n\nSelon nos données, vous perdez environ [Fuite MAD] MAD par mois. Nous avons préparé une optimisation complète avec photos HDR, tarification dynamique et gestion 100% déléguée.\n\nSeriez-vous ouvert à ce que je vous envoie l'audit PDF sans engagement sur WhatsApp ?"`, 'script1')}
                    className="text-xs flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                  >
                    {copiedId === 'script1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'script1' ? 'Copié !' : 'Copier Script'}
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-200 font-sans italic border border-slate-800/80 leading-relaxed">
                  "Bonjour [Nom Propriétaire], je suis [Votre Prénom] de la conciergerie [Nom Conciergerie] à Marrakech.<br /><br />
                  Je vous contacte au sujet de votre bien à [Quartier]. Nous venons d'auditer les annonces du secteur et votre logement a un potentiel exceptionnel mais subit actuellement une sous-tarification par rapport au Top 10% du quartier.<br /><br />
                  Selon nos données, vous perdez environ [Fuite MAD] MAD par mois. Nous avons préparé une optimisation complète avec photos HDR, tarification dynamique et gestion 100% déléguée.<br /><br />
                  Seriez-vous ouvert à ce que je vous envoie l'audit PDF sans engagement sur WhatsApp ?"
                </div>
              </div>

              {/* Script 2: Objection "20% c'est trop cher" */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Script 2 : Réponse à l'objection "20% de commission, c'est trop cher"
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(`"Je comprends tout à fait votre point, [Nom Propriétaire].\n\nCependant, regardons les chiffres nets : actuellement, vous touchez [Revenu Actuel] MAD/an en gérant tout vous-même (ménage, accueil, déclarations police, linge).\n\nAvec notre gestion professionnelle, le bien génère [Revenu Cible] MAD/an. Même après nos 20% de commission, votre revenu net dans votre poche passe à [Revenu Net Propriétaire] MAD/an.\n\nVous gagnez donc plus d'argent chaque mois tout en ayant zéro contrainte opérationnelle."`, 'script2')}
                    className="text-xs flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer"
                  >
                    {copiedId === 'script2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'script2' ? 'Copié !' : 'Copier Argumentaire'}
                  </button>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-200 font-sans italic border border-slate-800/80 leading-relaxed">
                  "Je comprends tout à fait votre point, [Nom Propriétaire].<br /><br />
                  Cependant, regardons les chiffres nets : actuellement, vous touchez [Revenu Actuel] MAD/an en gérant tout vous-même (ménage, accueil, déclarations police, linge).<br /><br />
                  Avec notre gestion professionnelle, le bien génère [Revenu Cible] MAD/an. Même après nos 20% de commission, votre revenu net dans votre poche passe à [Revenu Net Propriétaire] MAD/an.<br /><br />
                  Vous gagnez donc plus d'argent chaque mois tout en ayant zéro contrainte opérationnelle."
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
