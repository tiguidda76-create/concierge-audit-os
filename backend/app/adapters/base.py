from abc import ABC, abstractmethod
from app.models.channel_schemas import SyncPayload, ChannelSyncResponse


class BaseChannelAdapter(ABC):
    @abstractmethod
    async def update_listing(self, payload: SyncPayload) -> ChannelSyncResponse:
        """Pushes approved listing content into the PMS/Channel Manager."""
        pass

    @abstractmethod
    async def get_listing(self, listing_id: str) -> dict:
        """Fetches existing listing metadata from the PMS."""
        pass
