from fastapi import FastAPI, HTTPException, Depends
from fastapi.security.api_key import APIKey
# from typing import Union
from auth import get_api_key
from twitter_api import get_last_tweet_by

app = FastAPI()

@app.get('/')
async def main_index():
    raise HTTPException(status_code=404, detail=None)

@app.get('/last_tweet_by')
async def last_tweet_by(api_key: APIKey = Depends(get_api_key), username: str = ""):
    last_tweet = get_last_tweet_by(username)
    return last_tweet
