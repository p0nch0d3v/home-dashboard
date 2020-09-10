import axios from 'axios';
import moment from 'moment';

const apikey = '';
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
            value: conditions.Temperature.Metric.Value,
            unit: conditions.Temperature.Metric.Unit,
        },
        humidity: conditions.RelativeHumidity,
        feel: {
            value: conditions.RealFeelTemperature.Metric.Value,
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
        }
    }
}

export function getForecastHourly(forescastHourly, currentHour) {
    currentHour = new Date(currentHour);
    let forecast = [];
    forescastHourly.map(f => {
        if (moment(f.EpochDateTime * 1000) > moment(currentHour) && forecast.length < 4) {
          forecast.push({
              temp: {
                  value: f.Temperature.Value,
                  unit: f.Temperature.Unit
              },
              feel: {
                  value: f.RealFeelTemperature.Value,
                  unit: f.RealFeelTemperature.Unit
              },
              dateTime: moment(f.DateTime).format("HH:mm"),
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

export function getForecaseDaily(forescastResult, currentDay) {
    let forecast = [];
    forescastResult.map(f => {
        if (forecast.length < 4) {
            forecast.push({
                temp: {
                    min: {
                        value: f.Temperature.Maximum.Value,
                        unit: f.Temperature.Maximum.Unit
                    },
                    max: {
                        value: f.Temperature.Minimum.Value,
                        unit: f.Temperature.Minimum.Unit
                    }
                },
                date: {
                    date: moment(f.Date),
                    month: moment(f.Date).format('MMMM'),
                    dayNumber: moment(f.Date).format('DD'),
                    dayWeek: moment(f.Date).format('dddd')
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
