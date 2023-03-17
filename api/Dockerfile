FROM python:3-slim

ARG TWITTER_API_KEY=''
ARG TWITTER_API_KEY_SECRET=''
ARG API_KEY=''
ARG ALLOW_ORIGINS=''
ARG ENABLE_DOCS=''

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

COPY . /app

RUN ls -la /app

ENV TWITTER_API_KEY=${TWITTER_API_KEY}
ENV TWITTER_API_KEY_SECRET=${TWITTER_API_KEY_SECRET}
ENV API_KEY=${API_KEY}
ENV ALLOW_ORIGINS=${ALLOW_ORIGINS}
ENV ENABLE_DOCS=${ENABLE_DOCS}

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
