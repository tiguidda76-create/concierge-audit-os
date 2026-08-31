import os
from typing import Dict
from app.models.channel_schemas import ChannelProvider, SyncPayload, ChannelSyncResponse
from app.services.channel_manager.hostaway import HostawayClient
from app.services.channel_manager.guesty import GuestyClient
from app.services.channel_manager.base import BaseChannelAdapter


class ChannelManagerService:
    def __init__(self):
        self._adapters: Dict[ChannelProvider, BaseChannelAdapter] = {}
        self._init_adapters()

    def _init_adapters(self):
        hostaway_acc = os.getenv("HOSTAWAY_ACCOUNT_ID")
        hostaway_key = os.getenv("HOSTAWAY_API_KEY")
        if hostaway_acc and hostaway_key:
            self._adapters[ChannelProvider.HOSTAWAY] = HostawayClient(hostaway_acc, hostaway_key)
        elif os.getenv("PMS_SANDBOX_MODE", "true").lower() in ("true", "1", "yes"):
            self._adapters[ChannelProvider.HOSTAWAY] = HostawayClient("sandbox_acc", "sandbox_key")

        guesty_id = os.getenv("GUESTY_CLIENT_ID")
        guesty_secret = os.getenv("GUESTY_CLIENT_SECRET")
        if guesty_id and guesty_secret:
            self._adapters[ChannelProvider.GUESTY] = GuestyClient(guesty_id, guesty_secret)
        elif os.getenv("PMS_SANDBOX_MODE", "true").lower() in ("true", "1", "yes"):
            self._adapters[ChannelProvider.GUESTY] = GuestyClient("sandbox_client_id", "sandbox_secret")

    async def sync(self, provider: ChannelProvider, payload: SyncPayload) -> ChannelSyncResponse:
        adapter = self._adapters.get(provider)
        if not adapter:
            return ChannelSyncResponse(
                success=False,
                provider=provider,
                listing_id=payload.listing_id,
                updated_fields=[],
                raw_response={},
                error_message=f"Channel provider '{provider.value}' is not configured with valid credentials."
            )
        try:
            return await adapter.update_listing(payload)
        except Exception as e:
            return ChannelSyncResponse(
                success=False,
                provider=provider,
                listing_id=payload.listing_id,
                updated_fields=[],
                raw_response={},
                error_message=str(e)
            )


channel_service = ChannelManagerService()
