import axios from 'axios';
import moment from 'moment';

const apikey = import.meta.env.REACT_APP_ACCUWEATHER_API_KEY;
const language = 'en-us';
const baseUrl = 'http://dataservice.accuweather.com';
let defaultParams = {
    apikey: apikey,
    language: language,
    details: true,
    metric: true
};

export async function getCityInfo(search){
    let cityInfo = await axios({
        method: 'GET',
        url: `${baseUrl}/locations/v1/cities/search`,
        params: Object.assign({q: search}, defaultParams)
    }).then(r => { return r.data[0]; })
    .catch(e => { console.warn(e); return null; });
    return cityInfo;
}

export async function getCurrentConditions(cityKey){
    let conditions = await axios({
        method: 'GET',
        url: `${baseUrl}/currentconditions/v1/${cityKey}`,
        params: Object.assign({}, defaultParams)
    }).then(r => { return r.data[0]; })
    .catch(e => { console.warn(e); return null; });
    return conditions;
}

export async function getForecastHourly12(cityKey){
    let forecast = await axios({
        method: 'GET',
        url: `${baseUrl}/forecasts/v1/hourly/12hour/${cityKey}`,
        params: Object.assign({}, defaultParams)
    }).then(r => { return r.data; })
    .catch(e => { console.warn(e); return null; });
    return forecast;
}

export async function getForecaseDaily5(cityKey){
    let forecast = await axios({
        method: 'GET',
        url: `${baseUrl}/forecasts/v1/daily/5day/${cityKey}`,
        params: Object.assign({}, defaultParams)
    }).then(r => { return r.data.DailyForecasts; })
    .catch(e => { console.warn(e); return null; });
    return forecast;
}

export function getWeather(conditions){
    return {
        text: conditions.WeatherText,
        temp: {
            value: Math.round(conditions.Temperature.Metric.Value),
            unit: conditions.Temperature.Metric.Unit,
            formatted: Math.round(conditions.Temperature.Metric.Value) + ' °' + conditions.Temperature.Metric.Unit 
        },
        humidity: conditions.RelativeHumidity,
        feel: {
            value: Math.round(conditions.RealFeelTemperature.Metric.Value),
            unit: conditions.RealFeelTemperature.Metric.Unit,
        },
        icon: `https://www.accuweather.com/images/weathericons/${conditions.WeatherIcon}.svg`,
        uv: {
            index: conditions.UVIndex,
            text: conditions.UVIndexText
        },
        pressure: {
            value: conditions.Pressure.Metric.Value,
            unit: conditions.Pressure.Metric.Unit
        },
        wind: {
            direction: conditions.Wind.Direction.Localized,
            speed: {
                value: conditions.Wind.Speed.Metric.Value,
                unit: conditions.Wind.Speed.Metric.Unit
            }
        },
        tempMax: {
          value: null,
          unit: null
        },
        tempMin: {
          value: null,
          unit: null
        }
    }
}

export function getForecastHourly(forescastHourly, currentHour) {
    currentHour = new Date(currentHour);
    let forecast = [];
    forescastHourly.forEach(f => {
        if (moment(f.EpochDateTime * 1000) > moment(currentHour) && forecast.length < 5) {
          forecast.push({
              temp: {
                  value: Math.round(f.Temperature.Value),
                  unit: f.Temperature.Unit
              },
              feel: {
                  value: Math.round(f.RealFeelTemperature.Value),
                  unit: f.RealFeelTemperature.Unit
              },
              dateTime: moment(f.DateTime).format("hh A"),
              uv: {
                  index: f.UVIndex,
                  text: f.UVIndexText
              },
              icon: `https://www.accuweather.com/images/weathericons/${f.WeatherIcon}.svg`,
              text: f.IconPhrase,
              precipitationProbability: f.PrecipitationProbability
          });
        }
    });
    return forecast;
 }

export function getForecaseDaily(forescastResult) {
    let forecast = [];
    forescastResult.forEach(f => {
        if (forecast.length < 5) {
            forecast.push({
                temp: {
                    max: {
                        value: Math.round(f.Temperature.Maximum.Value),
                        unit: f.Temperature.Maximum.Unit
                    },
                    min: {
                        value: Math.round(f.Temperature.Minimum.Value),
                        unit: f.Temperature.Minimum.Unit
                    }
                },
                date: {
                    date: moment(f.Date),
                    month: moment(f.Date).format('MMM'),
                    dayNumber: moment(f.Date).format('DD'),
                    dayWeek: moment(f.Date).format('ddd')
                },
                icon: `https://www.accuweather.com/images/weathericons/${f.Day.Icon}.svg`,
                text: f.Day.IconPhrase,
                sunRise: moment(f.Sun.Rise),
                sunSet: moment(f.Sun.Set),
                precipitationProbability: f.Day.PrecipitationProbability
            });
        }
    });
    return forecast;
 }
