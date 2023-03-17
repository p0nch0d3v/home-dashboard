from fastapi import FastAPI, HTTPException, Depends
from fastapi.security.api_key import APIKey
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from auth import get_api_key
from twitter_api import get_last_tweet_by

load_dotenv()

enable_docs = os.getenv('ENABLE_DOCS')

print('enable docs', enable_docs)

if (enable_docs == True or enable_docs == 'True'):
    app = FastAPI(docs_url='/docs', redoc_url='/redoc')
else:
    app = FastAPI(docs_url=None, redoc_url=None)

allow_origins = os.getenv("ALLOW_ORIGINS")
if (allow_origins is None or len(allow_origins) == 0):
    allow_origins = '*'

origins = allow_origins.split(",")
print('allow origins', origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/')
async def main_index():
    raise HTTPException(status_code=404, detail=None)

@app.get('/last_tweet_by')
async def last_tweet_by(api_key: APIKey = Depends(get_api_key), username: str = ""):
    last_tweet = get_last_tweet_by(username)
    return last_tweet
