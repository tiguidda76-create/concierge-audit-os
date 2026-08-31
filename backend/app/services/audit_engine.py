import uuid
from datetime import datetime
from typing import Tuple, List
from ..models.schemas import (
    PropertyInput,
    FinancialMetrics,
    CategoryScore,
    AuditBreakdown,
    AuditRecommendation,
    AuditResult,
)


def calculate_financial_gap(prop: PropertyInput) -> FinancialMetrics:
    """
    Computes rigorous STR financial metrics:
    - Annual Current Revenue
    - Annual Benchmark / Target Potential
    - Revenue Leakage (Annual, Monthly, Daily)
    - ADR Gap & Occupancy Gap
    """
    target_adr = prop.target_adr if prop.target_adr and prop.target_adr > 0 else round(prop.current_adr * 1.22, 2)
    target_occ = prop.target_occupancy_pct if prop.target_occupancy_pct and prop.target_occupancy_pct > 0 else 76.0

    current_annual = round(365 * (prop.current_occupancy_pct / 100.0) * prop.current_adr, 2)
    target_annual = round(365 * (target_occ / 100.0) * target_adr, 2)
    
    annual_leakage = round(max(0.0, target_annual - current_annual), 2)
    monthly_leakage = round(annual_leakage / 12.0, 2)
    daily_leakage = round(annual_leakage / 365.0, 2)
    
    adr_gap = round(target_adr - prop.current_adr, 2)
    occ_gap = round(target_occ - prop.current_occupancy_pct, 2)
    leakage_pct = round((annual_leakage / target_annual * 100.0) if target_annual > 0 else 0.0, 1)

    return FinancialMetrics(
        current_annual_revenue=current_annual,
        target_annual_revenue=target_annual,
        annual_revenue_leakage=annual_leakage,
        monthly_revenue_leakage=monthly_leakage,
        daily_revenue_leakage=daily_leakage,
        adr_gap=adr_gap,
        occupancy_gap=occ_gap,
        leakage_percentage=leakage_pct,
        currency=prop.currency
    )


def compute_audit_scores(prop: PropertyInput, financials: FinancialMetrics) -> Tuple[AuditBreakdown, List[AuditRecommendation]]:
    """
    Evaluates listing against STR algorithmic ranking factors and financial efficiency.
    Returns AuditBreakdown and ranked actionable recommendations.
    """
    occ_score = min(100, int((prop.current_occupancy_pct / (prop.target_occupancy_pct or 78.0)) * 80))
    adr_perf = min(100, int((prop.current_adr / (prop.target_adr or (prop.current_adr * 1.2))) * 80))
    pricing_raw = int((occ_score * 0.5) + (adr_perf * 0.5))
    pricing_raw = max(25, min(98, pricing_raw))
    
    pricing_status = "Optimal" if pricing_raw >= 85 else ("Good" if pricing_raw >= 70 else ("Warning" if pricing_raw >= 50 else "Critical"))
    pricing = CategoryScore(
        name="Dynamic Pricing & Revenue Management",
        score=pricing_raw,
        weight_pct=30,
        status=pricing_status,
        insight=f"Underpriced by ~{financials.adr_gap} {prop.currency}/night with {financials.occupancy_gap}% occupancy gap vs top 10% district performers.",
        action_item="Implement automated minimum stay rules and dynamic weekend/event rate multipliers."
    )

    title_len = len(prop.current_title or "")
    has_keywords = any(kw in (prop.current_title or "").lower() for kw in ["luxury", "pool", "view", "suite", "riad", "center", "balcony", "terrace", "wifi", "design"])
    
    seo_score = 40
    if 30 <= title_len <= 52:
        seo_score += 30
    elif 15 <= title_len < 30:
        seo_score += 15
    if has_keywords:
        seo_score += 20
    if prop.current_description and len(prop.current_description) > 250:
        seo_score += 10
        
    seo_score = max(20, min(95, seo_score))
    seo_status = "Optimal" if seo_score >= 85 else ("Good" if seo_score >= 70 else ("Warning" if seo_score >= 50 else "Critical"))
    seo = CategoryScore(
        name="Listing SEO & Direct-Response Copywriting",
        score=seo_score,
        weight_pct=25,
        status=seo_status,
        insight=f"Title ({title_len} chars) lacks high-converting search tags & structured layout blocks on mobile OTA search.",
        action_item="Deploy 3 A/B title formulas and standard 4-block guest experience copy with bold feature tags."
    )

    photo_score = min(50, prop.photo_count * 2)
    if prop.has_professional_photos:
        photo_score += 45
    else:
        photo_score += 10
    photo_score = max(20, min(98, photo_score))
    visual_status = "Optimal" if photo_score >= 85 else ("Good" if photo_score >= 70 else ("Warning" if photo_score >= 50 else "Critical"))
    visual = CategoryScore(
        name="Visual Merchandising & Hero Photo Sequence",
        score=photo_score,
        weight_pct=25,
        status=visual_status,
        insight=f"Current gallery has {prop.photo_count} photos. {'Professional grade detected.' if prop.has_professional_photos else 'Lacks pro-lighting & staged hero sequence.'}",
        action_item="Re-sequence the first 5 OTA hero shots (Living/View -> Master Bed -> Signature Amenity -> Bath -> Kitchen) with clear caption storytelling."
    )

    rep_score = 50
    if prop.review_rating >= 4.90:
        rep_score += 45
    elif prop.review_rating >= 4.80:
        rep_score += 35
    elif prop.review_rating >= 4.70:
        rep_score += 20
    elif prop.review_rating >= 4.50:
        rep_score += 5
    else:
        rep_score -= 15
        
    if prop.review_count >= 50:
        rep_score += 10
    elif prop.review_count >= 15:
        rep_score += 5
        
    if prop.instant_book_enabled:
        rep_score += 5
        
    rep_score = max(25, min(99, rep_score))
    rep_status = "Optimal" if rep_score >= 85 else ("Good" if rep_score >= 70 else ("Warning" if rep_score >= 50 else "Critical"))
    reputation = CategoryScore(
        name="Guest Reputation & Algorithmic Trust",
        score=rep_score,
        weight_pct=20,
        status=rep_status,
        insight=f"Rating is {prop.review_rating}/5.0 ({prop.review_count} reviews). Algorithmic badge requirements need strict consistency.",
        action_item="Maintain automated guest checkout touchpoints to consistently secure 5-star ratings."
    )

    overall = int(
        (pricing.score * 0.30) +
        (seo.score * 0.25) +
        (visual.score * 0.25) +
        (reputation.score * 0.20)
    )

    if overall >= 88:
        grade = "A (Market Leader)"
    elif overall >= 78:
        grade = "B+ (High Potential)"
    elif overall >= 65:
        grade = "B- (Revenue Leaking)"
    elif overall >= 50:
        grade = "C (Significant Sub-Optimization)"
    else:
        grade = "D (Urgent Turnaround Required)"

    breakdown = AuditBreakdown(
        overall_score=overall,
        score_grade=grade,
        pricing_score=pricing,
        seo_content_score=seo,
        visual_score=visual,
        reputation_score=reputation
    )

    recommendations: List[AuditRecommendation] = [
        AuditRecommendation(
            priority="HIGH",
            pillar="Pricing & Yield",
            title=f"Capture annual {financials.currency} {financials.annual_revenue_leakage:,.0f} leakage",
            impact_estimate=f"+{financials.monthly_revenue_leakage:,.0f} {financials.currency}/month",
            action=f"Increase ADR from {prop.current_adr} {prop.currency} to {prop.target_adr or (prop.current_adr*1.22):.1f} {prop.currency} using dynamic seasonal rule sets."
        ),
        AuditRecommendation(
            priority="HIGH",
            pillar="OTA Algorithm SEO",
            title="Deploy High-CTR A/B Tested Title Sequence",
            impact_estimate="+22% Search Impressions",
            action="Replace vague title with power-keyword variant highlighting top signature amenities and district prestige."
        ),
        AuditRecommendation(
            priority="MEDIUM",
            pillar="Visual Merchandising",
            title="Re-order First 5 Hero Photos",
            impact_estimate="+18% Click-Through-Rate",
            action="Apply the 5-shot conversion sequence to hook mobile scrollers in the first 1.8 seconds."
        ),
        AuditRecommendation(
            priority="MEDIUM",
            pillar="Listing Architecture",
            title="Structure Description into 4 Scannable Blocks",
            impact_estimate="+14% Booking Conversion",
            action="Segment copy into Hook, Space, Amenities, and Neighborhood to eliminate guest hesitation."
        )
    ]

    return breakdown, recommendations


def run_full_audit(prop: PropertyInput) -> AuditResult:
    """
    Executes the complete audit agent calculation pipeline.
    """
    audit_id = prop.id or f"aud_{uuid.uuid4().hex[:10]}"
    financials = calculate_financial_gap(prop)
    breakdown, recommendations = compute_audit_scores(prop, financials)
    
    trigger_solution = breakdown.overall_score < 80

    return AuditResult(
        audit_id=audit_id,
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        property_input=prop,
        financials=financials,
        breakdown=breakdown,
        recommendations=recommendations,
        trigger_solution_agent=trigger_solution,
        status="NEEDS_OPTIMIZATION" if trigger_solution else "COMPLETED"
    )
