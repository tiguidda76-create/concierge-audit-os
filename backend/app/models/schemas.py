from typing import List, Optional, Literal, Dict, Any
from enum import Enum
from datetime import datetime
from pydantic import BaseModel, Field


class PropertyInput(BaseModel):
    id: Optional[str] = Field(None, description="Unique listing identifier")
    name: str = Field(..., description="Property listing name or internal code", example="Riad Dar Atlas - Luxury Villa")
    district: str = Field(..., description="Neighborhood or city district", example="Medina / Palmeraie")
    city: str = Field("Marrakech", description="City location")
    bedrooms: int = Field(2, ge=0, description="Number of bedrooms")
    bathrooms: float = Field(2.0, ge=0.5, description="Number of bathrooms")
    currency: str = Field("EUR", description="Currency symbol/code (EUR, USD, MAD, GBP)")
    
    # Quantitative Inputs
    current_adr: float = Field(..., gt=0, description="Current Average Daily Rate (ADR)", example=145.0)
    current_occupancy_pct: float = Field(..., ge=0, le=100, description="Current Occupancy Rate %", example=58.0)
    target_adr: Optional[float] = Field(None, gt=0, description="Target or Market Average ADR (Optional - computed if omitted)")
    target_occupancy_pct: Optional[float] = Field(78.0, ge=0, le=100, description="Target or Benchmark Occupancy %")
    
    # Qualitative / Listing Status
    review_rating: float = Field(4.72, ge=0, le=5.0, description="Current review score (e.g. 4.72)")
    review_count: int = Field(24, ge=0, description="Total number of reviews")
    photo_count: int = Field(18, ge=0, description="Number of photos uploaded on OTA")
    has_professional_photos: bool = Field(False, description="Whether photos are professionally staged & shot")
    instant_book_enabled: bool = Field(True, description="Whether Instant Book is turned on")
    
    # Existing Copy
    current_title: Optional[str] = Field("Cozy apartment in city center", description="Current OTA listing title")
    current_description: Optional[str] = Field("Nice place with kitchen, wifi and aircon.", description="Current OTA description")
    owner_name: Optional[str] = Field("Property Owner", description="Owner or client contact name")
    owner_email: Optional[str] = Field(None, description="Owner contact email")


class MoroccoLeadInfo(BaseModel):
    owner_name: str
    phone: Optional[str] = None
    city: str = "Marrakech"
    district: str = "Guéliz"


class MoroccoCompliance(BaseModel):
    guest_registration_process: str = "manual"
    building_security_type: str = "guard_24_7"
    syndic_airbnb_friendly: bool = True


class MoroccoAmenities(BaseModel):
    has_fiber_optic: bool = True
    ac_coverage: str = "all_rooms"
    has_private_terrace: bool = True
    has_pool: bool = False
    traditional_decor_score: str = "modern_moroccan"


class MoroccoCurrentPerformance(BaseModel):
    current_adr_mad: float = 800.0
    current_occupancy_rate_pct: float = 50.0
    review_score: float = 4.6
    total_reviews: int = 18
    applies_seasonal_rates: bool = False


class MoroccoLeadPayload(BaseModel):
    lead_info: MoroccoLeadInfo
    morocco_compliance: MoroccoCompliance
    morocco_amenities: MoroccoAmenities
    current_performance: MoroccoCurrentPerformance

    def to_property_input(self) -> PropertyInput:
        return PropertyInput(
            name=f"Modern Moroccan Residence w/ Terrace - {self.lead_info.district}",
            district=self.lead_info.district,
            city=self.lead_info.city,
            bedrooms=2,
            bathrooms=1.5,
            currency="MAD",
            current_adr=self.current_performance.current_adr_mad,
            current_occupancy_pct=self.current_performance.current_occupancy_rate_pct,
            target_adr=1300.0,
            target_occupancy_pct=78.0,
            review_rating=self.current_performance.review_score,
            review_count=self.current_performance.total_reviews,
            photo_count=16,
            has_professional_photos=False,
            instant_book_enabled=True,
            current_title=f"Appartement {self.lead_info.district} Marrakech",
            current_description="Bel appartement avec terrasse et wifi.",
            owner_name=self.lead_info.owner_name
        )


class FinancialMetrics(BaseModel):
    current_annual_revenue: float
    target_annual_revenue: float
    annual_revenue_leakage: float
    monthly_revenue_leakage: float
    daily_revenue_leakage: float
    adr_gap: float
    occupancy_gap: float
    leakage_percentage: float
    currency: str


class CategoryScore(BaseModel):
    name: str
    score: int = Field(..., ge=0, le=100)
    weight_pct: int
    status: Literal["Optimal", "Good", "Warning", "Critical"]
    insight: str
    action_item: str


class AuditBreakdown(BaseModel):
    overall_score: int = Field(..., ge=0, le=100)
    score_grade: str = Field(..., example="B- (Revenue Leaking)")
    pricing_score: CategoryScore
    seo_content_score: CategoryScore
    visual_score: CategoryScore
    reputation_score: CategoryScore


class AuditRecommendation(BaseModel):
    priority: Literal["HIGH", "MEDIUM", "LOW"]
    pillar: str
    title: str
    impact_estimate: str
    action: str


class AuditResult(BaseModel):
    audit_id: str
    created_at: str
    property_input: PropertyInput
    financials: FinancialMetrics
    breakdown: AuditBreakdown
    recommendations: List[AuditRecommendation]
    trigger_solution_agent: bool
    status: Literal["COMPLETED", "NEEDS_OPTIMIZATION"]


class TitleVariant(BaseModel):
    variant_type: Literal["Power Hook (High CTR)", "Amenity & Luxury Focus", "Location & Experience Focus"]
    title: str
    character_count: int
    target_channel: str = "Airbnb & Booking.com"
    strategy_note: str


class DescriptionBlock(BaseModel):
    section_id: str
    heading: str
    content: str
    char_count: int
    purpose: str


class PhotoStrategyItem(BaseModel):
    position: int
    shot_type: str
    subject: str
    staging_notes: str
    recommended_caption: str


class SolutionPlan(BaseModel):
    audit_id: str
    created_at: str
    property_name: str
    title_variants: List[TitleVariant]
    description_blocks: List[DescriptionBlock]
    full_compiled_description: str
    photo_strategy: List[PhotoStrategyItem]
    pricing_strategy_summary: str
    status: Literal["DRAFT", "APPROVED", "REJECTED", "APPLIED"]


class ApprovalRequest(BaseModel):
    audit_id: str
    selected_title: str
    approved_description: Optional[str] = None
    applied_by: str = "Manager"
    notes: Optional[str] = None


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


class ChannelSyncRequest(BaseModel):
    audit_id: str
    channel_type: Literal["hostaway", "guesty", "smoobu", "channex"]
    listing_id: str
    api_key: Optional[str] = "sandbox_key_active"
    selected_title: str
    selected_description: str


class ChannelSyncResult(BaseModel):
    success: bool
    audit_id: str
    channel: str
    listing_id: str
    sync_timestamp: str
    payload_dispatched: dict
    message: str


class ClipboardBundle(BaseModel):
    title: str
    description: str
    captions: List[str]
    quick_copy_all: str


class OnboardingPack(BaseModel):
    markdown_content: str
    json_export: dict
