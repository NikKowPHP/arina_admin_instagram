# =========================================================================
# 1. BUILDER STAGE: To build dependencies without polluting the final image
# =========================================================================
FROM python:3.11-slim as builder

# Set environment variables to prevent writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install build-time system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    zlib1g-dev \
    libjpeg-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install Python requirements (leveraging cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# =========================================================================
# 2. FINAL STAGE: The actual image that will be deployed
# =========================================================================
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PATH="/opt/venv/bin:$PATH"

# Create a non-root user and group
RUN addgroup --system app && adduser --system --ingroup app app

# Set the working directory
WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy application code from the current directory
COPY . .

# *** THIS IS THE FIX: Make the entrypoint script executable ***
RUN chmod +x entrypoint.sh

# Change ownership of the app directory to the non-root user
RUN chown -R app:app /app

# Switch to the non-root user
USER app

# Expose the port (good practice, though not used by the job)
EXPOSE 8000

# The CMD will be the only thing that runs.
CMD ["sh", "-c", "./entrypoint.sh && python main.py"]