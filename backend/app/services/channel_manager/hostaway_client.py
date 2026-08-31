import httpx
import time
from typing import Optional, Dict, Any
from app.services.channel_manager.base import BaseChannelAdapter
from app.models.channel_schemas import SyncPayload, ChannelSyncResponse, ChannelProvider


class HostawayClient(BaseChannelAdapter):
    BASE_URL = "https://api.hostaway.com/v1"

    def __init__(self, account_id: str, api_key: str):
        self.account_id = account_id
        self.api_key = api_key
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0

    async def _get_auth_header(self) -> Dict[str, str]:
        if not self._access_token or time.time() >= self._token_expires_at:
            await self._authenticate()
        return {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }

    async def _authenticate(self) -> None:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                f"{self.BASE_URL}/accessTokens",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.account_id,
                    "client_secret": self.api_key,
                    "scope": "general"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if resp.status_code != 200:
                raise RuntimeError(f"Hostaway auth failed [{resp.status_code}]: {resp.text}")
            
            data = resp.json()
            self._access_token = data["access_token"]
            self._token_expires_at = time.time() + data.get("expires_in", 86400) - 300

    async def get_listing(self, listing_id: str) -> dict:
        headers = await self._get_auth_header()
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{self.BASE_URL}/listings/{listing_id}", headers=headers)
            resp.raise_for_status()
            return resp.json().get("result", {})

    async def update_listing(self, payload: SyncPayload) -> ChannelSyncResponse:
        headers = await self._get_auth_header()
        update_dict: Dict[str, Any] = {}
        updated_fields = []

        if payload.title:
            update_dict["name"] = payload.title
            updated_fields.append("name")
        if payload.description:
            update_dict["description"] = payload.description
            updated_fields.append("description")
        if payload.space:
            update_dict["space"] = payload.space
            updated_fields.append("space")
        if payload.access:
            update_dict["guestAccess"] = payload.access
            updated_fields.append("guestAccess")
        if payload.neighborhood:
            update_dict["neighborhood"] = payload.neighborhood
            updated_fields.append("neighborhood")
        if payload.notes:
            update_dict["notes"] = payload.notes
            updated_fields.append("notes")

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.put(
                f"{self.BASE_URL}/listings/{payload.listing_id}",
                json=update_dict,
                headers=headers
            )
            
            if resp.status_code != 200:
                return ChannelSyncResponse(
                    success=False,
                    provider=ChannelProvider.HOSTAWAY,
                    listing_id=payload.listing_id,
                    updated_fields=[],
                    raw_response=resp.json() if resp.headers.get("content-type") == "application/json" else {"text": resp.text},
                    error_message=f"HTTP {resp.status_code}: {resp.text}"
                )

            return ChannelSyncResponse(
                success=True,
                provider=ChannelProvider.HOSTAWAY,
                listing_id=payload.listing_id,
                updated_fields=updated_fields,
                raw_response=resp.json()
            )
