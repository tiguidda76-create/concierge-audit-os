import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const mdContent = `# Pack d'Optimisation & Onboarding Conciergerie Marrakech
**Référence Audit :** ${params.id}
**Généré par :** Concierge Audit OS (Marrakech Engine v2.4)
**Marché :** Marrakech, Maroc

---

## 1. Titre Recommandé (Haute Conversion Mobile)
> **★ Luxueuse Suite avec Terrasse • Fibre & Clim • Guéliz**

---

## 2. Description d'Annonce Structurée en 4 Blocs
### ✦ BIENVENUE DANS VOTRE HAVRE DE PAIX À MARRAKECH
Découvrez une expérience d'exception au cœur de Marrakech. Conçu pour les voyageurs exigeants, nomades digitaux et familles en quête de sérénité, ce sublime logement allie le raffinement de l'hospitalité marocaine et le confort moderne haut de gamme.

### ✦ LES ESPACES & SUITES PARENTALES
• Suite Principale : Lit King-Size grand confort avec literie haut de gamme en satin de coton égyptien.
• Deuxième Chambre : Literie Queen modulable avec rideaux occultants.
• Salon Beldi Contemporain : Espace de vie baigné de lumière naturelle avec Smart TV 55" 4K.
• Salles de Bain : Douche à l'italienne effet pluie et produits d'accueil artisanaux à la fleur d'oranger.

### ✦ ÉQUIPEMENTS & CONFORT PREMIUM
• Fibre Optique Très Haut Débit (250+ Mbps)
• Climatisation Réversible Intégrale dans toutes les pièces
• Cuisine Équipée de Chef : Machine Nespresso, plaques induction et grand réfrigérateur
• Terrasse / Solarium privatif
• Résidence sécurisée avec gardien 24h/24 et 7j/7.

### ✦ EMPLACEMENT & SERVICES CONCIERGERIE
• À 3-5 min à pied des meilleurs restaurants et commerces.
• À 10 min de la Place Jemaa el-Fna et du Jardin Majorelle.
• Service Conciergerie : Chauffeur VIP, réservations de tables et excursions désert d'Agafay.

---

## 3. Séquence des 5 Photos Héro (Ordre de Conversion)
1. **Photo Héro :** Grand Salon / Terrasse ensoleillée avec thé marocain.
2. **Suite Master :** Lit King-Size dressé avec éclairage tamisé.
3. **Terrasse / Rooftop :** Espace lounge extérieur avec vue.
4. **Salle de Bain Spa :** Douche italienne en tadelakt.
5. **Cuisine & Café :** Station Nespresso soignée.
`;

  return NextResponse.json({
    audit_id: params.id,
    markdown_content: mdContent
  });
}
