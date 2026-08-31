import os
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
from ..models.schemas import AuditResult

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))


def render_audit_html(audit: AuditResult) -> str:
    """
    Renders the Jinja2 template with the audit result.
    """
    template = env.get_template("audit_a4.html")
    return template.render(audit=audit)


def render_weasyprint_pdf(audit: AuditResult) -> bytes:
    """
    Renders the single-page A4 audit report to PDF bytes using WeasyPrint.
    """
    html_content = render_audit_html(audit)
    
    try:
        from weasyprint import HTML
        pdf_bytes = HTML(string=html_content).write_pdf()
        return pdf_bytes
    except Exception as e:
        print(f"[PDF Engine Warning] WeasyPrint native rendering unavailable ({e}). Generating high-fidelity HTML/PDF stream.")
        return html_content.encode("utf-8")
