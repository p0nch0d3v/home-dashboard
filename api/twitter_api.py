from base64 import b64encode
from dotenv import dotenv_values, load_dotenv
import http.client
import json
import os
import tweepy

load_dotenv()

def get_auth():
    consumer_key = os.getenv('TWITTER_CONSUMER_KEY')
    consumer_secret = os.getenv('TWITTER_CONSUMER_SECRET')
    access_token = os.getenv('TWITTER_ACCESS_TOKEN')
    access_token_secret = os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
    auth = tweepy.OAuth1UserHandler(consumer_key, consumer_secret, access_token, access_token_secret)
    return auth

def get_tweepy_api(auth):
    api = tweepy.API(auth, wait_on_rate_limit=True)
    return api

def get_user(api, username):
    user = api.get_user(screen_name=username)
    return {'id': user.id, 'username': user.screen_name, 'name': user.name}

def get_tweets(api, username, count):
    tweets = api.user_timeline(screen_name=username, count=100, exclude_replies=True)
    simple_tweets = []
    for tweet in tweets:
        tweet_extended = api.get_status(tweet.id, tweet_mode='extended')
        simple_tweets.append({ 'text': tweet_extended.full_text, 'created_at': tweet.created_at })
        if len(simple_tweets) >= count:
            break
    return simple_tweets

def get_last_tweet_by(username):
    try:
        auth = get_auth()
        api = get_tweepy_api(auth)
        user = get_user(api, username)
        tweets = get_tweets(api, username, 5)
        return { 'user': user, 'tweets': tweets }
    except:
        return None
    return None
