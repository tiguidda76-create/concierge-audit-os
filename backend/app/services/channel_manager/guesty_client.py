import httpx
import time
from typing import Optional, Dict, Any
from app.services.channel_manager.base import BaseChannelAdapter
from app.models.channel_schemas import SyncPayload, ChannelSyncResponse, ChannelProvider


class GuestyClient(BaseChannelAdapter):
    AUTH_URL = "https://open-api.guesty.com/oauth2/token"
    BASE_URL = "https://open-api.guesty.com/v1"

    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0

    async def _get_auth_header(self) -> Dict[str, str]:
        if not self._access_token or time.time() >= self._token_expires_at:
            await self._authenticate()
        return {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }

    async def _authenticate(self) -> None:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                self.AUTH_URL,
                data={
                    "grant_type": "client_credentials",
                    "scope": "open-api",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"}
            )
            if resp.status_code != 200:
                raise RuntimeError(f"Guesty auth failed [{resp.status_code}]: {resp.text}")
            
            data = resp.json()
            self._access_token = data["access_token"]
            self._token_expires_at = time.time() + data.get("expires_in", 86400) - 300

    async def get_listing(self, listing_id: str) -> dict:
        headers = await self._get_auth_header()
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"{self.BASE_URL}/listings/{listing_id}", headers=headers)
            resp.raise_for_status()
            return resp.json()

    async def update_listing(self, payload: SyncPayload) -> ChannelSyncResponse:
        headers = await self._get_auth_header()
        update_dict: Dict[str, Any] = {}
        updated_fields = []

        if payload.title:
            update_dict["title"] = payload.title
            updated_fields.append("title")

        public_desc: Dict[str, Any] = {}
        if payload.summary:
            public_desc["summary"] = payload.summary
            updated_fields.append("publicDescription.summary")
        if payload.space:
            public_desc["space"] = payload.space
            updated_fields.append("publicDescription.space")
        if payload.access:
            public_desc["access"] = payload.access
            updated_fields.append("publicDescription.access")
        if payload.neighborhood:
            public_desc["neighborhood"] = payload.neighborhood
            updated_fields.append("publicDescription.neighborhood")
        if payload.notes:
            public_desc["notes"] = payload.notes
            updated_fields.append("publicDescription.notes")

        if public_desc:
            update_dict["publicDescription"] = public_desc

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.put(
                f"{self.BASE_URL}/listings/{payload.listing_id}",
                json=update_dict,
                headers=headers
            )

            if resp.status_code != 200:
                return ChannelSyncResponse(
                    success=False,
                    provider=ChannelProvider.GUESTY,
                    listing_id=payload.listing_id,
                    updated_fields=[],
                    raw_response=resp.json() if resp.headers.get("content-type") == "application/json" else {"text": resp.text},
                    error_message=f"HTTP {resp.status_code}: {resp.text}"
                )

            return ChannelSyncResponse(
                success=True,
                provider=ChannelProvider.GUESTY,
                listing_id=payload.listing_id,
                updated_fields=updated_fields,
                raw_response=resp.json()
            )
