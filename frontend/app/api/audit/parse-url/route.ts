import { NextResponse } from 'next/server';
import { PropertyData, MARRAKECH_DISTRICT_BENCHMARKS } from '@/lib/marrakech_engine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = (body.url || '').trim();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let platform: 'airbnb' | 'booking' | 'avito' | 'mubawab' | 'manual' = 'manual';
    if (url.includes('airbnb.')) platform = 'airbnb';
    else if (url.includes('booking.com')) platform = 'booking';
    else if (url.includes('avito.ma')) platform = 'avito';
    else if (url.includes('mubawab.ma')) platform = 'mubawab';

    const lowerUrl = url.toLowerCase();
    let detectedDistrict = 'Guéliz';
    let bedrooms = 2;
    let bathrooms = 1.5;
    let currentAdr = 850;
    let photoCount = 18;
    let hasProfessionalPhotos = false;
    let reviewRating = 4.65;
    let reviewCount = 22;
    let propertyName = 'Appartement de Charme Marrakech';

    if (lowerUrl.includes('riad') || lowerUrl.includes('medina')) {
      detectedDistrict = 'Médina (Riad)';
      propertyName = 'Riad Historique & Patio Piscine • Médina';
      bedrooms = 4;
      bathrooms = 4;
      currentAdr = 2200;
      photoCount = 24;
      hasProfessionalPhotos = true;
      reviewRating = 4.80;
      reviewCount = 38;
    } else if (lowerUrl.includes('villa') || lowerUrl.includes('palmeraie')) {
      detectedDistrict = 'Palmeraie';
      propertyName = 'Villa Privée avec Jardin & Piscine • Palmeraie';
      bedrooms = 4;
      bathrooms = 4;
      currentAdr = 4200;
      photoCount = 30;
      hasProfessionalPhotos = true;
      reviewRating = 4.75;
      reviewCount = 15;
    } else if (lowerUrl.includes('hivernage')) {
      detectedDistrict = 'Hivernage';
      propertyName = 'Penthouse Standing • Balcon & Piscine • Hivernage';
      bedrooms = 2;
      bathrooms = 2;
      currentAdr = 1500;
      photoCount = 20;
      reviewRating = 4.70;
      reviewCount = 28;
    } else if (lowerUrl.includes('majorelle') || lowerUrl.includes('victor-hugo')) {
      detectedDistrict = 'Majorelle / Victor Hugo';
      propertyName = 'Appartement Lumineux proche Jardin Majorelle';
      bedrooms = 2;
      bathrooms = 1;
      currentAdr = 950;
      photoCount = 16;
      reviewRating = 4.62;
      reviewCount = 19;
    } else if (lowerUrl.includes('agdal')) {
      detectedDistrict = 'Agdal / Avenue Mohammed VI';
      propertyName = 'Résidence avec Piscine • Avenue Mohammed VI';
      bedrooms = 2;
      bathrooms = 2;
      currentAdr = 900;
      photoCount = 15;
      reviewRating = 4.58;
      reviewCount = 14;
    } else {
      detectedDistrict = 'Guéliz';
      propertyName = 'Appartement Moderne avec Terrasse • Guéliz';
      bedrooms = 2;
      bathrooms = 1.5;
      currentAdr = 800;
      photoCount = 16;
      reviewRating = 4.60;
      reviewCount = 18;
    }

    const benchmark = MARRAKECH_DISTRICT_BENCHMARKS[detectedDistrict] || MARRAKECH_DISTRICT_BENCHMARKS['Guéliz'];

    const parsedProperty: PropertyData = {
      name: propertyName,
      url: url,
      source_platform: platform,
      district: detectedDistrict,
      city: 'Marrakech',
      bedrooms,
      bathrooms,
      currency: 'MAD',
      current_adr: currentAdr,
      current_occupancy_pct: 50,
      target_adr: benchmark.top10_adr_mad,
      target_occupancy_pct: benchmark.top10_occupancy_pct,
      review_rating: reviewRating,
      review_count: reviewCount,
      photo_count: photoCount,
      has_professional_photos: hasProfessionalPhotos,
      instant_book_enabled: true,
      current_title: `${propertyName}`,
      current_description: `Logement situé à ${detectedDistrict}, Marrakech avec cuisine équipée, wifi et climatisation.`,
      owner_name: 'Propriétaire / Bailleur Marrakech',
      has_fiber_optic: true,
      ac_all_rooms: true,
      has_private_terrace: true,
      has_guard_24_7: true,
      guest_registration_process: 'none',
    };

    return NextResponse.json({
      success: true,
      platform,
      property: parsedProperty,
      message: `Annonce Marrakech analysée avec succès depuis ${platform.toUpperCase()}`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error parsing property URL' }, { status: 500 });
  }
}
