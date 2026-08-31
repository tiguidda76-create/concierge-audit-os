import { NextResponse } from 'next/server';
import { generateMarrakechSolutions, calculateMarrakechAudit } from '@/lib/marrakech_engine';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    let body: any = null;
    try {
      body = await req.json();
    } catch (e) {
      // Body is optional
    }

    let audit = body?.audit;
    if (!audit) {
      audit = calculateMarrakechAudit({
        name: 'Résidence Marrakech Guéliz',
        district: 'Guéliz',
        city: 'Marrakech',
        bedrooms: 2,
        bathrooms: 1.5,
        currency: 'MAD',
        current_adr: 800,
        current_occupancy_pct: 50,
        target_adr: 1350,
        target_occupancy_pct: 79,
        review_rating: 4.60,
        review_count: 18,
        photo_count: 16,
        has_professional_photos: false,
        instant_book_enabled: true,
        current_title: 'Appartement sympa à Guéliz',
        current_description: 'Bel appartement à Guéliz avec terrasse et wifi.',
        owner_name: 'Propriétaire Marrakech',
        has_fiber_optic: true,
        ac_all_rooms: true,
        has_private_terrace: true,
        has_guard_24_7: true,
        guest_registration_process: 'none',
      });
      audit.audit_id = params.id;
    }

    const solutions = generateMarrakechSolutions(audit);
    return NextResponse.json(solutions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error generating solutions' }, { status: 500 });
  }
}
