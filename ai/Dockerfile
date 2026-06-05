# Dockerfile for AI Model API
FROM tensorflow/tensorflow:2.16.1

WORKDIR /app

# Install FastAPI and other api-specific requirements (Tensorflow & Keras are preinstalled in base image)
RUN pip install --no-cache-dir fastapi uvicorn pillow python-dotenv numpy

# Copy model, dataset, server script and configuration
COPY . .

EXPOSE 8000

CMD ["python", "api.py"]
