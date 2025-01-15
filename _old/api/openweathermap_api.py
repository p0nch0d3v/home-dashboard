def get_current_weather(latitude, longitude):
    url = __get_base_url(latitude, longitude)
    return url

def get_forecast_hourly():
    pass

def get_forecast_daily():
    pass

def __get_base_url(latitude, longitude):
    api_key = "no-api-key"
    baseUrl = f"https://api.openweathermap.org/data/2.5/onecall?appid={api_key}&lat={latitude}&lon={longitude}"
    return baseUrl