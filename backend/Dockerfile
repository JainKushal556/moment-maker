# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# Install dependencies into a virtual environment so we can copy them cleanly
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Copy only the venv from builder (keeps image lean)
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy application source (secrets are injected via Render env vars, NOT copied)
COPY main.py .
COPY api/ ./api/
COPY core/ ./core/

# Render sets PORT automatically; default to 8000 for local Docker testing
ENV PORT=8000

# Health-check so Render knows the container is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT}/health')"

EXPOSE ${PORT}

# Uvicorn — binds to 0.0.0.0 so Docker can forward the port
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT} --workers 2
