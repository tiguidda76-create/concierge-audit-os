import { NextResponse } from 'next/server';
import { calculateMarrakechAudit, PropertyData } from '@/lib/marrakech_engine';

export async function POST(req: Request) {
  try {
    const body: PropertyData = await req.json();
    const result = calculateMarrakechAudit(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error calculating audit' }, { status: 400 });
  }
}
