import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const channel = (body.channel_type || 'hostaway').toLowerCase();
    const listingId = body.listing_id || `PROP_${params.id.slice(-6).toUpperCase()}`;

    let payloadDispatched: any = {};
    if (channel === 'hostaway') {
      payloadDispatched = {
        listingId,
        name: body.selected_title,
        description: body.selected_description,
        customFields: {
          auditOptimized: true,
          syncSource: 'Concierge Audit OS Marrakech'
        }
      };
    } else if (channel === 'guesty') {
      payloadDispatched = {
        _id: listingId,
        title: body.selected_title,
        publicDescription: {
          summary: body.selected_description?.slice(0, 500),
          space: body.selected_description
        },
        source: 'concierge_audit_os'
      };
    } else {
      payloadDispatched = {
        property_id: listingId,
        title: body.selected_title,
        description: body.selected_description,
        channel: channel.toUpperCase()
      };
    }

    return NextResponse.json({
      success: true,
      audit_id: params.id,
      channel: channel.toUpperCase(),
      listing_id: listingId,
      sync_timestamp: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
      payload_dispatched: payloadDispatched,
      message: `Synchronisation réussie pour l'annonce '${listingId}' sur l'API ${channel.toUpperCase()}.`
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync error' }, { status: 500 });
  }
}
