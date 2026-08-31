from enum import Enum
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ChannelProvider(str, Enum):
    HOSTAWAY = "hostaway"
    GUESTY = "guesty"
    SMOOBU = "smoobu"
    CHANNEX = "channex"


class SyncPayload(BaseModel):
    listing_id: str = Field(..., description="Target property ID in the PMS")
    title: Optional[str] = Field(None, description="Optimized listing title")
    description: Optional[str] = Field(None, description="Full markdown/plain text listing description")
    summary: Optional[str] = Field(None, description="Short summary/teaser")
    space: Optional[str] = Field(None, description="Description of the interior space")
    access: Optional[str] = Field(None, description="Guest access instructions")
    neighborhood: Optional[str] = Field(None, description="Neighborhood overview")
    notes: Optional[str] = Field(None, description="Additional house rules or notes")
    photo_order_ids: Optional[List[str]] = Field(None, description="Ordered photo IDs to resequence")


class ChannelSyncResponse(BaseModel):
    success: bool
    provider: ChannelProvider
    listing_id: str
    updated_fields: List[str]
    raw_response: Dict[str, Any]
    error_message: Optional[str] = None
