import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      audit_id: params.id,
      status: 'APPROVED',
      approved_title: body.selected_title,
      approved_description: body.approved_description,
      approved_by: body.applied_by || 'Owner/Concierge Manager',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Approval error' }, { status: 500 });
  }
}
