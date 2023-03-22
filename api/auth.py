#from config import Settings, get_settings
from dotenv import load_dotenv
from fastapi.security.api_key import APIKeyHeader, APIKeyQuery
from fastapi import Security, HTTPException, Depends
from starlette.status import HTTP_403_FORBIDDEN
import os

load_dotenv()

api_key_query = APIKeyQuery(name='access_token', auto_error=False)
api_key_header = APIKeyHeader(name='access_token', auto_error=False)

async def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header)
):

    system_api_key = os.getenv("API_KEY")
    print('System API KEY', system_api_key)
    print('Query  API KEY', api_key_query)
    print('Header API KEY', api_key_header)

    if api_key_query == system_api_key:
        return api_key_query
    elif api_key_header == system_api_key:
        return api_key_header
    else:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Could not validate API KEY")