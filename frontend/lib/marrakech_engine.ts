// Marrakech Hyper-Local STR Benchmark & Valuation Engine

export interface MarrakechDistrictBenchmark {
  district: string;
  type: 'apartment' | 'riad' | 'villa' | 'penthouse';
  top10_adr_mad: number;
  market_avg_adr_mad: number;
  top10_occupancy_pct: number;
  market_avg_occupancy_pct: number;
  key_drivers: string[];
}

export const MARRAKECH_DISTRICT_BENCHMARKS: Record<string, MarrakechDistrictBenchmark> = {
  'Guéliz': {
    district: 'Guéliz',
    type: 'apartment',
    top10_adr_mad: 1350,
    market_avg_adr_mad: 800,
    top10_occupancy_pct: 79,
    market_avg_occupancy_pct: 52,
    key_drivers: ['Terrasse privative', 'Fibre optique 200M', 'Climatisation intégrale', 'Gardien 24/7', 'Proche Carré Eden'],
  },
  'Hivernage': {
    district: 'Hivernage',
    type: 'penthouse',
    top10_adr_mad: 2200,
    market_avg_adr_mad: 1300,
    top10_occupancy_pct: 82,
    market_avg_occupancy_pct: 56,
    key_drivers: ['Piscine de résidence', 'Balcon lounge', 'Déco contemporaine', 'Sécurité VIP', 'Restaurants & Nightlife à pied'],
  },
  'Médina (Riad)': {
    district: 'Médina (Riad)',
    type: 'riad',
    top10_adr_mad: 3500,
    market_avg_adr_mad: 1900,
    top10_occupancy_pct: 84,
    market_avg_occupancy_pct: 54,
    key_drivers: ['Patio avec bassin/piscine', 'Rooftop vue Koutoubia/Atlas', 'Service petit-déjeuner', 'Personnel de maison', 'Emplacement Derb accessible'],
  },
  'Palmeraie': {
    district: 'Palmeraie',
    type: 'villa',
    top10_adr_mad: 6500,
    market_avg_adr_mad: 3800,
    top10_occupancy_pct: 74,
    market_avg_occupancy_pct: 44,
    key_drivers: ['Piscine privée chauffée', 'Grand jardin paysager', 'Gardien & Cuisinière', 'Calme absolu', 'Parking sécurisé'],
  },
  'Agdal / Avenue Mohammed VI': {
    district: 'Agdal',
    type: 'apartment',
    top10_adr_mad: 1400,
    market_avg_adr_mad: 850,
    top10_occupancy_pct: 76,
    market_avg_occupancy_pct: 48,
    key_drivers: ['Résidence fermée avec piscine', 'Terrasse ensoleillée', 'Clim réversible', 'Parking sous-sol'],
  },
  'Majorelle / Victor Hugo': {
    district: 'Majorelle / Victor Hugo',
    type: 'apartment',
    top10_adr_mad: 1550,
    market_avg_adr_mad: 900,
    top10_occupancy_pct: 80,
    market_avg_occupancy_pct: 55,
    key_drivers: ['Proche Jardin Majorelle & YSL', 'Décoration design beldi chic', 'Wi-Fi ultra rapide', 'Ascenseur'],
  },
  'Amelkis / Golfs': {
    district: 'Amelkis',
    type: 'villa',
    top10_adr_mad: 5800,
    market_avg_adr_mad: 3400,
    top10_occupancy_pct: 72,
    market_avg_occupancy_pct: 46,
    key_drivers: ['Vue frontale parcours de golf', 'Piscine privée', 'Design contemporain', 'Sécurité 24/7'],
  },
  'Autre Quartier (Marrakech)': {
    district: 'Marrakech',
    type: 'apartment',
    top10_adr_mad: 1200,
    market_avg_adr_mad: 750,
    top10_occupancy_pct: 75,
    market_avg_occupancy_pct: 50,
    key_drivers: ['Propreté irréprochable', 'Climatisation', 'Wi-Fi', 'Accueil réactif'],
  },
};

export interface PropertyData {
  id?: string;
  name: string;
  url?: string;
  source_platform?: 'airbnb' | 'booking' | 'avito' | 'mubawab' | 'manual';
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

export interface AdrCalculatorParams {
  platform: 'airbnb' | 'booking' | 'avito' | 'mubawab' | 'manual';
  rawDisplayedPrice: number;
  isMonthlyRate?: boolean;
  district: string;
  bedrooms: number;
  hasFiberOptic: boolean;
  hasAcAllRooms: boolean;
  hasPrivateTerrace: boolean;
  hasPrivatePool: boolean;
  hasGuard247: boolean;
  reviewScore: number;
}

export interface AdrValuationResult {
  rawPrice: number;
  platform: string;
  platformCommissionPct: number;
  platformCommissionDeduction: number;
  touristTaxDeductionMad: number;
  netOwnerDailyRateMad: number;
  
  seasonalAdr: {
    peakSeasonMad: number;
    shoulderSeasonMad: number;
    lowSeasonMad: number;
    weightedAnnualAdrMad: number;
  };

  optimizedYieldTargetMad: number;
  amenityMultipliersTotalPct: number;
  valuationInsights: string[];
}

export function calculateRealAdrBreakdown(params: AdrCalculatorParams): AdrValuationResult {
  let baseDailyRate = params.rawDisplayedPrice;

  if (params.isMonthlyRate || (params.rawDisplayedPrice > 4500 && (params.platform === 'avito' || params.platform === 'mubawab'))) {
    baseDailyRate = Math.round((params.rawDisplayedPrice * 1.55) / 30);
  }

  let commPct = 0;
  let touristTaxMad = 0;

  switch (params.platform) {
    case 'airbnb':
      commPct = 15;
      touristTaxMad = 0;
      break;
    case 'booking':
      commPct = 19;
      touristTaxMad = Math.round(params.bedrooms * 2 * 25);
      break;
    case 'avito':
      commPct = 0;
      touristTaxMad = 0;
      break;
    case 'mubawab':
      commPct = 0;
      touristTaxMad = 0;
      break;
    default:
      commPct = 5;
      touristTaxMad = 0;
      break;
  }

  const commissionDeduction = Math.round((baseDailyRate * commPct) / 100);
  const netDailyRate = Math.max(150, Math.round(baseDailyRate - commissionDeduction - (touristTaxMad > 0 ? touristTaxMad / 2.8 : 0)));

  let multiplierPct = 0;
  const insights: string[] = [];

  if (params.hasFiberOptic) {
    multiplierPct += 10;
    insights.push('+10% Prime Fibre Optique 200M (attractivité digital nomads)');
  }
  if (params.hasAcAllRooms) {
    multiplierPct += 15;
    insights.push('+15% Climatisation intégrale (indispensable pour l\'été à Marrakech)');
  }
  if (params.hasPrivateTerrace) {
    multiplierPct += 18;
    insights.push('+18% Terrasse / Solarium privatif avec vue dégagée');
  }
  if (params.hasPrivatePool) {
    multiplierPct += 40;
    insights.push('+40% Piscine privée / Bassin de Riad');
  }
  if (params.hasGuard247) {
    multiplierPct += 10;
    insights.push('+10% Sécurité & Gardiennage 24/7 (rassurance voyageur)');
  }

  if (params.reviewScore >= 4.90) {
    multiplierPct += 12;
    insights.push('+12% Badge d\'excellence / Note 4.9+ ★');
  } else if (params.reviewScore < 4.60) {
    multiplierPct -= 15;
    insights.push('-15% Pénalité d\'algorithme due à une note < 4.6 ★');
  }

  const peakAdr = Math.round(netDailyRate * 1.48 * (1 + multiplierPct / 100));
  const shoulderAdr = Math.round(netDailyRate * (1 + multiplierPct / 100));
  const lowSeasonFactor = params.hasPrivatePool || params.hasAcAllRooms ? 0.78 : 0.65;
  const lowAdr = Math.round(netDailyRate * lowSeasonFactor * (1 + multiplierPct / 100));

  const weightedAnnualAdr = Math.round((peakAdr * 0.48) + (shoulderAdr * 0.32) + (lowAdr * 0.20));
  const benchmark = MARRAKECH_DISTRICT_BENCHMARKS[params.district] || MARRAKECH_DISTRICT_BENCHMARKS['Guéliz'];
  const optimizedYieldTarget = Math.max(weightedAnnualAdr, benchmark.top10_adr_mad);

  return {
    rawPrice: params.rawDisplayedPrice,
    platform: params.platform,
    platformCommissionPct: commPct,
    platformCommissionDeduction: commissionDeduction,
    touristTaxDeductionMad: touristTaxMad,
    netOwnerDailyRateMad: netDailyRate,
    seasonalAdr: {
      peakSeasonMad: peakAdr,
      shoulderSeasonMad: shoulderAdr,
      lowSeasonMad: lowAdr,
      weightedAnnualAdrMad: weightedAnnualAdr,
    },
    optimizedYieldTargetMad: optimizedYieldTarget,
    amenityMultipliersTotalPct: multiplierPct,
    valuationInsights: insights,
  };
}

export function calculateMarrakechAudit(prop: PropertyData) {
  const auditId = prop.id || `aud_${Math.random().toString(36).substring(2, 9)}`;
  const benchmark = MARRAKECH_DISTRICT_BENCHMARKS[prop.district] || MARRAKECH_DISTRICT_BENCHMARKS['Guéliz'];
  
  const targetAdr = prop.target_adr && prop.target_adr > 0 ? prop.target_adr : benchmark.top10_adr_mad;
  const targetOcc = prop.target_occupancy_pct && prop.target_occupancy_pct > 0 ? prop.target_occupancy_pct : benchmark.top10_occupancy_pct;
  
  const currentAnnualRev = Math.round(365 * (prop.current_occupancy_pct / 100) * prop.current_adr);
  const targetAnnualRev = Math.round(365 * (targetOcc / 100) * targetAdr);
  const annualLeakage = Math.max(0, targetAnnualRev - currentAnnualRev);
  const monthlyLeakage = Math.round(annualLeakage / 12);
  const dailyLeakage = Math.round(annualLeakage / 365);
  
  const adrGap = Math.round(targetAdr - prop.current_adr);
  const occGap = Math.round(targetOcc - prop.current_occupancy_pct);
  const leakagePct = targetAnnualRev > 0 ? Number(((annualLeakage / targetAnnualRev) * 100).toFixed(1)) : 0;

  let pricingScore = Math.round(((prop.current_adr / targetAdr) * 45) + ((prop.current_occupancy_pct / targetOcc) * 45) + (prop.current_adr >= benchmark.market_avg_adr_mad ? 10 : 0));
  pricingScore = Math.max(20, Math.min(98, pricingScore));

  let seoScore = 35;
  const titleLen = (prop.current_title || '').length;
  if (titleLen >= 32 && titleLen <= 55) seoScore += 25;
  else if (titleLen >= 18) seoScore += 12;
  
  const kwMatch = ['riad', 'suite', 'terrasse', 'piscine', 'gueliz', 'hivernage', 'palmeraie', 'vue', 'luxe', 'calme', 'wifi', 'design', 'atlas'];
  const hasKw = kwMatch.some(k => (prop.current_title || '').toLowerCase().includes(k));
  if (hasKw) seoScore += 25;
  if (prop.current_description && prop.current_description.length > 200) seoScore += 15;
  seoScore = Math.max(20, Math.min(96, seoScore));

  let visualScore = Math.min(45, prop.photo_count * 2.5);
  if (prop.has_professional_photos) visualScore += 45;
  else visualScore += 10;
  if (prop.has_private_terrace) visualScore += 5;
  visualScore = Math.max(25, Math.min(98, Math.round(visualScore)));

  let repScore = 40;
  if (prop.review_rating >= 4.90) repScore += 45;
  else if (prop.review_rating >= 4.80) repScore += 35;
  else if (prop.review_rating >= 4.70) repScore += 25;
  else if (prop.review_rating >= 4.50) repScore += 10;
  else repScore -= 10;
  
  if (prop.review_count >= 30) repScore += 10;
  else if (prop.review_count >= 10) repScore += 5;
  if (prop.instant_book_enabled) repScore += 5;
  repScore = Math.max(20, Math.min(99, repScore));

  const overallScore = Math.round(
    (pricingScore * 0.30) +
    (seoScore * 0.25) +
    (visualScore * 0.25) +
    (repScore * 0.20)
  );

  let grade = 'B- (Fuite de Revenu Modérée)';
  if (overallScore >= 88) grade = 'A (Top 10% Marrakech Leader)';
  else if (overallScore >= 78) grade = 'B+ (Fort Potentiel d\'Optimisation)';
  else if (overallScore >= 60) grade = 'B- (Sous-Tarification & Fuite de Revenu)';
  else if (overallScore >= 45) grade = 'C (Déficit d\'Attractivité & Pertes STR)';
  else grade = 'D (Restructuration Urgente)';

  const formatStatus = (s: number) => s >= 80 ? 'Optimal' : (s >= 65 ? 'Good' : (s >= 50 ? 'Warning' : 'Critical'));

  return {
    audit_id: auditId,
    created_at: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
    property_input: prop,
    benchmark_data: benchmark,
    financials: {
      current_annual_revenue: currentAnnualRev,
      target_annual_revenue: targetAnnualRev,
      annual_revenue_leakage: annualLeakage,
      monthly_revenue_leakage: monthlyLeakage,
      daily_revenue_leakage: dailyLeakage,
      adr_gap: adrGap,
      occupancy_gap: occGap,
      leakage_percentage: leakagePct,
      currency: prop.currency || 'MAD'
    },
    breakdown: {
      overall_score: overallScore,
      score_grade: grade,
      pricing_score: {
        name: 'Tarification Dynamique & Yield Management',
        score: pricingScore,
        weight_pct: 30,
        status: formatStatus(pricingScore),
        insight: `Sous-tarifié de ~${adrGap} MAD/nuit face aux meilleurs logements de ${prop.district} (${targetAdr} MAD/nuit en haute saison).`,
        action_item: 'Activer la tarification dynamique haute/basse saison et le minimum de 2 à 3 nuits le week-end.'
      },
      seo_content_score: {
        name: 'SEO & Copywriting OTA (Airbnb / Booking)',
        score: seoScore,
        weight_pct: 25,
        status: formatStatus(seoScore),
        insight: `Le titre actuel (${titleLen} caractères) manque des mots-clés à fort taux de clic recherchés par les voyageurs à Marrakech.`,
        action_item: 'Déployer les 3 variantes de titres A/B et structurer l\'annonce en 4 blocs immersifs.'
      },
      visual_score: {
        name: 'Merchandising Visuel & Séquence Hero 5 Photos',
        score: visualScore,
        weight_pct: 25,
        status: formatStatus(visualScore),
        insight: `La galerie compte ${prop.photo_count} photos. ${prop.has_professional_photos ? 'Qualité photo certifiée.' : 'Absence de shooting HDR professionnel grand angle et mise en scène.'}`,
        action_item: 'Réorganiser les 5 premières photos pour capter l\'attention en moins de 2 secondes sur mobile.'
      },
      reputation_score: {
        name: 'Confiance Algorithmique & Avis Voyageurs',
        score: repScore,
        weight_pct: 20,
        status: formatStatus(repScore),
        insight: `Note réelle de ${prop.review_rating} ★ (${prop.review_count} avis). Nécessite une régularité de 5★ pour le badge Coup de Cœur Voyageur.`,
        action_item: 'Automatiser le message de bienvenue et le suivi post-check-in pour maximiser les avis 5 étoiles.'
      }
    },
    recommendations: [
      {
        priority: 'HIGH',
        pillar: 'Yield & Revenus Marrakech',
        title: `Capter les ${annualLeakage.toLocaleString('fr-FR')} MAD de fuite annuelle`,
        impact_estimate: `+${monthlyLeakage.toLocaleString('fr-FR')} MAD / mois`,
        action: `Augmenter l'ADR de ${prop.current_adr} MAD à ${targetAdr} MAD avec une grille tarifaire dynamique adaptée aux événements et saisons de Marrakech.`
      },
      {
        priority: 'HIGH',
        pillar: 'Copywriting Direct-Response',
        title: 'Déployer le Titre Mobile Haute Conversion',
        impact_estimate: '+24% de Clics sur l\'Annonce',
        action: `Remplacer le titre générique par la formule intégrant le quartier (${prop.district}), la terrasse et la fibre 200M.`
      },
      {
        priority: 'MEDIUM',
        pillar: 'Séquence 5 Photos Héro',
        title: 'Mettre en scène la Terrasse & le Salon Beldi',
        impact_estimate: '+18% de Taux de Réservation',
        action: 'Appliquer l\'ordre de conversion : Vue Salon/Terrasse -> Suite Parentale -> Espace Détente -> Salle de Bain Spa -> Cuisine Nespresso.'
      },
      {
        priority: 'MEDIUM',
        pillar: 'Conformité & Conciergerie',
        title: 'Digitaliser les Fiches de Police & Check-in',
        impact_estimate: 'Fluidité & Sécurité 100%',
        action: 'Mettre en place le pré-enregistrement digital des passeports pour les autorités et le gardiennage 24/7.'
      }
    ],
    trigger_solution_agent: overallScore < 85,
    status: overallScore < 85 ? 'NEEDS_OPTIMIZATION' : 'COMPLETED'
  };
}

export function generateMarrakechSolutions(audit: any) {
  const prop = audit.property_input;
  const district = prop.district || 'Guéliz Marrakech';
  const beds = prop.bedrooms || 2;
  const baths = prop.bathrooms || 1.5;
  const hasPool = prop.name.toLowerCase().includes('riad') || prop.name.toLowerCase().includes('villa') || prop.district === 'Palmeraie' || prop.district === 'Médina (Riad)';
  const cleanOriginalName = prop.name.replace(/[★•|-].*$/, '').trim();

  const titleA = hasPool
    ? `★ ${cleanOriginalName} w/ Piscine Privée • ${district}`
    : `★ ${cleanOriginalName} • Terrasse & Fibre • ${district}`;
    
  const titleB = `Superbe ${beds}Ch avec Vue & Rooftop • Design Beldi Chic • ${district}`;
  const titleC = `Oasis de Calme à 5 Min du Centre • Gardien 24/7 • ${district}`;

  const variants = [
    {
      variant_type: 'Power Hook (High CTR - Mobile Airbnb)',
      title: titleA.substring(0, 50),
      character_count: Math.min(50, titleA.length),
      target_channel: 'Airbnb & Booking Mobile',
      strategy_note: `Format court accrocheur intégrant "${cleanOriginalName}" et les atouts clés de ${district}.`
    },
    {
      variant_type: 'Amenity & Prestige Beldi Chic',
      title: titleB.substring(0, 55),
      character_count: Math.min(55, titleB.length),
      target_channel: 'Recherche Google & OTA Premium',
      strategy_note: `Met en valeur les ${beds} chambres, le design raffiné et l'emplacement prestige à ${district}.`
    },
    {
      variant_type: 'Sécurité, Calme & Emplacement Privilégié',
      title: titleC.substring(0, 50),
      character_count: Math.min(50, titleC.length),
      target_channel: 'Clientèle Familles & Séjours Longs',
      strategy_note: `Rassure immédiatement sur le calme, l'accès rapide et le gardiennage 24/7.`
    }
  ];

  const blocks = [
    {
      section_id: 'hook_summary',
      heading: '✦ BIENVENUE DANS VOTRE HAVRE DE PAIX À MARRAKECH',
      content: `Découvrez une expérience d'exception à ${prop.name}. Conçu pour les voyageurs exigeants, nomades digitaux et familles en quête de sérénité à ${district}, ce logement allie le raffinement de l'hospitalité marocaine et le confort moderne haut de gamme. Profitez d'une ambiance lumineuse, d'un calme absolu et de prestations de conciergerie 5 étoiles.`,
      char_count: 360,
      purpose: 'Accroche directe visible avant le repli \'En savoir plus\' sur smartphone.'
    },
    {
      section_id: 'the_space',
      heading: '✦ LES ESPACES & SUITES PARENTALES',
      content: `• Suite Principale : Lit King-Size grand confort avec literie haut de gamme en satin de coton égyptien.\n• Chambres Additionnelles : ${beds > 1 ? `${beds - 1} chambre(s) modulable(s) avec rideaux occultants.` : 'Espace salon convertible avec literie premium.'}\n• Salon Beldi Contemporain : Espace de vie baigné de lumière naturelle avec Smart TV 55" 4K (Netflix & IPTV).\n• Salles de Bain : ${baths} salle(s) de bain avec douche à l'italienne effet pluie et produits d'accueil artisanaux à la fleur d'oranger.`,
      char_count: 480,
      purpose: 'Clarifie la disposition et garantit la promesse de literie et de propreté.'
    },
    {
      section_id: 'amenities',
      heading: '✦ ÉQUIPEMENTS & CONFORT PREMIUM',
      content: `• Fibre Optique Très Haut Débit (250+ Mbps) : Connexion stable idéale pour le télétravail et visio-conférences.\n• Climatisation Réversible Intégrale dans toutes les pièces (chaud/froid silencieux).\n• Cuisine Équipée de Chef : Machine Nespresso, plaques induction, grand réfrigérateur et vaisselle complète.\n• Terrasse / Solarium privatif pour vos petits-déjeuners au soleil ou apéritifs au coucher du soleil.\n• Résidence sécurisée avec gardien 24h/24 et 7j/7.`,
      char_count: 520,
      purpose: 'Coche tous les filtres de recherche prioritaires des plateformes.'
    },
    {
      section_id: 'neighborhood',
      heading: '✦ EMPLACEMENT STRATÉGIQUE & SERVICES CONCIERGERIE',
      content: `Idéalement situé dans le quartier recherché de ${district} :\n• À 3-5 min à pied des meilleurs restaurants, cafés branchés et commerces.\n• À 10 min de la Place Jemaa el-Fna et du Jardin Majorelle.\n• À 15 min de l'Aéroport International Marrakech-Ménara.\n• Service Conciergerie Privée : Chauffeur VIP, réservations de tables d'exception, excursions désert d'Agafay et cuisinière à domicile sur demande.`,
      char_count: 490,
      purpose: 'Guide le voyageur et valorise les services additionnels de votre conciergerie.'
    }
  ];

  const fullCompiled = blocks.map(b => `${b.heading}\n${b.content}`).join('\n\n');

  const photoStrategy = [
    {
      position: 1,
      shot_type: 'Photo Héro Principale (Salon ou Terrasse)',
      subject: `Espace de vie principal de ${cleanOriginalName} - ${district}`,
      staging_notes: 'Lumière naturelle dorée, coussins gonflés, plantes vertes, table basse dressée avec thé marocain.',
      recommended_caption: `Votre oasis de confort et de lumière à ${district}, Marrakech.`
    },
    {
      position: 2,
      shot_type: 'Suite Parentale & Literie de Luxe',
      subject: 'Lit King-Size avec tête de lit sculptée',
      staging_notes: 'Draps blancs impeccables, éclairage tamisé des lampes de chevet, serviettes délicatement pliées.',
      recommended_caption: 'Nuits réparatrices dans un lit King-Size d\'un confort digne des plus grands palaces.'
    },
    {
      position: 3,
      shot_type: 'Terrasse Privative ou Patio / Piscine',
      subject: 'Espace lounge extérieur et vue dégagée',
      staging_notes: 'Table dressée pour le petit-déjeuner au soleil, lanternes traditionnelles allumées au crépuscule.',
      recommended_caption: 'Détendez-vous sur votre terrasse privative après une journée à explorer la ville.'
    },
    {
      position: 4,
      shot_type: 'Salle de Bain Design Spa',
      subject: 'Douche italienne en tadelakt & vasque en cuivre',
      staging_notes: 'Miroir rétroéclairé allumé, flacons de savon bio à l\'huile d\'argan disposés avec soin.',
      recommended_caption: 'Espace bien-être raffiné avec douche pluie et cosmétiques marocains.'
    },
    {
      position: 5,
      shot_type: 'Coin Café Nespresso & Cuisine Moderne',
      subject: 'Station Nespresso & plan de travail soigné',
      staging_notes: 'Tasses prêtes, capsules colorées en présentation, fruits frais du marché dans une coupe.',
      recommended_caption: 'Commencez vos journées avec un café d\'exception dans une cuisine tout équipée.'
    }
  ];

  return {
    audit_id: audit.audit_id,
    created_at: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
    property_name: prop.name,
    title_variants: variants,
    description_blocks: blocks,
    full_compiled_description: fullCompiled,
    photo_strategy: photoStrategy,
    pricing_strategy_summary: `Tarif actuel extrait : ${prop.current_adr} MAD/nuit | Cible Yield Haute Saison : ${Math.round(audit.financials.target_annual_revenue / 365 / (audit.property_input.target_occupancy_pct / 100 || 0.78))} MAD/nuit avec séjour minimum de 2 nuits le week-end.`,
    status: 'DRAFT'
  };
}
