# Use the official Python image from the Docker Hub
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Environment variables will be passed at runtime
ENV SUPABASE_KEY=public-anon-key

# Make the main script executable
RUN chmod +x main.py

# Run the application
CMD ["python", "main.py"]