from base64 import b64encode
from dotenv import dotenv_values, load_dotenv
import http.client
import json
import os

def basic_auth(username, password):
    token = b64encode(f"{username}:{password}".encode('utf-8')).decode("ascii")
    return f'Basic {token}'

def generate_token(api_key, api_secret_key):
    conn = http.client.HTTPSConnection("api.twitter.com")
    headers = {'Authorization': basic_auth(api_key, api_secret_key)}
    conn.request("POST", "/oauth2/token?grant_type=client_credentials",
                 '', headers)

    response = conn.getresponse()
    data = response.read()
    decoded_data = data.decode("utf-8")
    token = json.loads(decoded_data)
    return token['access_token']

def get_user(bearer_token, username):
    url = f"/2/users/by/username/{username}"

    conn = http.client.HTTPSConnection("api.twitter.com")
    headers = {"Authorization": f"Bearer {bearer_token}"}
    conn.request("GET", url, '', headers)

    response = conn.getresponse()
    data = response.read()
    decoded_data = data.decode("utf-8")
    user = json.loads(decoded_data)
    return user['data']

def get_tweets(bearer_token, user_id):
    url = f"https://api.twitter.com/2/users/{user_id}/tweets?max_results=5&exclude=retweets,replies&tweet.fields=created_at"

    conn = http.client.HTTPSConnection("api.twitter.com")
    headers = {"Authorization": f"Bearer {bearer_token}"}
    conn.request("GET", url, '', headers)

    response = conn.getresponse()
    data = response.read()
    decoded_data = data.decode("utf-8")
    tweets = json.loads(decoded_data)
    return tweets['data']

def get_last_tweet_by(username):
    API_KEY = os.getenv('TWITTER_API_KEY')
    API_KEY_SECRET = os.getenv('TWITTER_API_KEY_SECRET')
    print(API_KEY, API_KEY_SECRET)

    if 'TWITTER_API_KEY' not in os.environ:
        return { 'error': 'No API key found' }

    if 'TWITTER_API_KEY_SECRET' not in os.environ:
        return { 'error': 'No API key secreat found' }

    if 'TWITTER_API_KEY' in os.environ and 'TWITTER_API_KEY_SECRET' in os.environ:
        token = generate_token(API_KEY, API_KEY_SECRET)

        user = get_user(token, username)
        user_id = user['id']
        tweets = get_tweets(token, user_id)
        print('tweets', tweets[0])
        return { 'user': user, 'tweet': tweets[0] }
    return None
