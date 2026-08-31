from fastapi import APIRouter, HTTPException, Depends
from app.models.channel_schemas import ChannelProvider, SyncPayload, ChannelSyncResponse
from app.services.channel_manager.service import channel_service

router = APIRouter(prefix="/api/channel", tags=["Channel Manager"])


@router.post("/sync/{provider}", response_model=ChannelSyncResponse)
async def push_listing_update(provider: ChannelProvider, payload: SyncPayload):
    response = await channel_service.sync(provider, payload)
    if not response.success:
        raise HTTPException(status_code=502, detail=response.model_dump())
    return response
