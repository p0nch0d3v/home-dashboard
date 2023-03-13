from fastapi import FastAPI
from typing import Union
from twitter_api import get_last_tweet_by

app = FastAPI()

@app.get('/')
async def main_index():
    return {'Hi': 'FastAPI'}

@app.get('/last_tweet_by')
async def last_tweet_by(username: str = ""):
    last_tweet = get_last_tweet_by(username)
    return last_tweet
