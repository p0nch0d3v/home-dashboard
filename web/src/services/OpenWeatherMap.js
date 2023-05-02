import axios from 'axios';
import dayjs from 'dayjs/esm/index.js'
import 'dayjs/esm/locale/es'
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

import {
    getUvIndexDescription,
    getCardinalDirectionFromDegree,
    consoleDebug,
    capitalize,
    getMoonPhaseTextAndClass,
    getUvIndexColor,
    getAitQualityDescription
} from '../helpers';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from './DataService';

import { GetConfigurations } from './ConfigService';

dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(utc);

const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const imageBaseUrl = 'https://openweathermap.org/img/wn/{icon}@4x.png'
const units = 'metric';

export async function getCurrentWeather(latitude, longitude, translator, force = false) {
    dayjs.locale(GetConfigurations().language);
    let conditionsInfo = getStorageValue(StorageKeys.currentConditions);
    if (conditionsInfo && force === false) {
        return conditionsInfo;
    }
    else if (latitude && longitude) {
        consoleDebug('Calling Current Weather');
        const url = `${getBaseUrl(latitude, longitude)}&exclude=minutely,hourly,daily,alerts`;
        let conditions = await axios({
            method: 'GET',
            url: url
        }).then(r => { return { ...r.data.current, timezone: r.data.timezone }; })
            .catch(e => { console.warn(e); return null; });

        if (conditions) {
            conditionsInfo = {
                text: capitalize(conditions.weather[0].description),
                temp: {
                    value: Math.round(conditions.temp),
                    unit: 'C',
                    formatted: `${Math.round(conditions.temp)} °C`
                },
                humidity: conditions.humidity,
                feel: {
                    value: Math.round(conditions.feels_like),
                    unit: 'C',
                    formatted: `${Math.round(conditions.feels_like)} °C`
                },
                icon: imageBaseUrl.replace('{icon}', conditions.weather[0].icon),
                iconCode: `icon_${conditions.weather[0].icon}`,
                uv: {
                    index: Math.round(conditions.uvi),
                    text: getUvIndexDescription(Math.round(conditions.uvi), translator),
                    color: getUvIndexColor(Math.round(conditions.uvi))
                },
                pressure: {
                    value: conditions.pressure,
                    unit: 'hPa'
                },
                wind: {
                    direction: getCardinalDirectionFromDegree(conditions.wind_deg, translator),
                    speed: {
                        value: Math.round(conditions.wind_speed * 3.6),
                        unit: 'Km/h'
                    }
                },
                tempMax: {
                    value: null,
                    unit: null
                },
                tempMin: {
                    value: null,
                    unit: null
                },
                sunset: dayjs(conditions.sunset * 1000).utc(false),
                sunrise: dayjs(conditions.sunrise * 1000).utc(false),
            };

            conditionsInfo.formattedSunset = conditionsInfo.sunset.tz(conditions.timezone).format('hh:mm A');
            conditionsInfo.formattedSunrise = conditionsInfo.sunrise.tz(conditions.timezone).format('hh:mm A');

            conditionsInfo.dayLight = (conditionsInfo.sunset - conditionsInfo.sunrise);

            const sunrise = dayjs.tz(conditionsInfo.sunrise.utc(), conditions.timezone);
            const sunset = dayjs.tz(conditionsInfo.sunset.utc(), conditions.timezone);

            let dayLight = sunset.subtract(sunrise.hour(), 'hours');
            dayLight = dayLight.subtract(sunrise.minute(), 'minutes');
            dayLight = dayLight.subtract(sunrise.second(), 'seconds');

            conditionsInfo.formattedDayLight = dayLight.format("HH:mm");
            conditionsInfo.dayLigthData = getDayLigthData(conditionsInfo.sunrise, conditionsInfo.sunset, conditions.timezone);

            setStorageValue(StorageKeys.currentConditions, conditionsInfo);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
    }
    return conditionsInfo;
}

export async function getCurrentAirQuality(latitude, longitude, translator, force = false) {
    
    dayjs.locale(GetConfigurations().language);
    let airQualityInfo = getStorageValue(StorageKeys.airQuality);
    if (airQualityInfo && force === false) {
        return airQualityInfo;
    }
    else if (latitude && longitude) {
        consoleDebug('Calling Air Quality');
        const url =`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${GetConfigurations().OPENWEATHERMAP_API_KEY}`

        let airQuality = await axios({
            method: 'GET',
            url: url
        }).then(r => r.data.list[0] )
        .catch(e => { console.warn(e); return null; });

        if (airQuality) {
            airQualityInfo = {
                aqi: airQuality.main.aqi,
                aqiText: getAitQualityDescription(airQuality.main.aqi, translator),
                components: airQuality.components
            }

            setStorageValue(StorageKeys.airQuality, airQualityInfo);
            setStorageValue(StorageKeys.lastUpdate.airQuality, Date.now());
        }
    }
    return airQualityInfo;
}

export async function getForecastHourly(latitude, longitude, translator, force = false) {
    dayjs.locale(GetConfigurations().language);
    let forecastInfo = getStorageValue(StorageKeys.forecastHourly);
    if (forecastInfo && force === false) {
        return forecastInfo;
    }
    else if (latitude && longitude) {
        consoleDebug('Calling Forecast Hourly');
        let forecast = await axios({
            method: 'GET',
            url: `${getBaseUrl(latitude, longitude)}&exclude=current,minutely,daily,alerts`
        }).then(r => { return r.data.hourly; })
            .catch(e => { console.warn(e); return null; });
        forecastInfo = [];

        if (forecast) {
            const limit = 5;
            const now = Date.now();

            forecast.forEach(f => {
                const dateTime = f.dt * 1000;
                if ((dayjs(dateTime).hour() >= dayjs(now).hour()
                    || dayjs(dateTime).date() > dayjs(now).date()
                    || dayjs(dateTime).month() > dayjs(now).month()
                    || dayjs(dateTime).year() > dayjs(now).year())
                    && forecastInfo.length < limit) {

                    forecastInfo.push({
                        temp: {
                            value: Math.round(f.temp),
                            unit: 'C'
                        },
                        feel: {
                            value: Math.round(f.feels_like),
                            unit: 'C'
                        },
                        dateTime: dateTime,
                        formattedDateTime: dayjs(dateTime).format("hh A"),
                        uv: {
                            index: Math.round(f.uvi),
                            text: getUvIndexDescription(Math.round(f.uvi), translator),
                            color: getUvIndexColor(Math.round(f.uvi))
                        },
                        icon: imageBaseUrl.replace('{icon}', f.weather[0].icon),
                        iconCode: `icon_${f.weather[0].icon}`,
                        text: capitalize(f.weather[0].description),
                        precipitationProbability: Math.round(f.pop * 100)
                    });
                }
            });
            setStorageValue(StorageKeys.forecastHourly, forecastInfo);
            setStorageValue(StorageKeys.lastUpdate.forecastHourly, Date.now());
        }
    }
    return forecastInfo;
}

export async function getForecastDaily(latitude, longitude, localeLang, translator, force = false) {
    dayjs.locale(GetConfigurations().language);
    let forecastInfo = getStorageValue(StorageKeys.forecastDaily);
    if (forecastInfo && force === false) {
        return forecastInfo;
    }
    else if (latitude && longitude) {
        consoleDebug('Calling Forecast Daily');
        let forecast = await axios({
            method: 'GET',
            url: `${getBaseUrl(latitude, longitude)}&exclude=current,minutely,hourly,alerts`
        }).then(r => { return r.data.daily; })
            .catch(e => { console.warn(e); return null; });
        forecastInfo = [];

        if (forecast) {
            const limit = 6;
            const now = dayjs(Date.now()).format('YYYY-MM-DD');

            forecast.forEach(f => {
                if (forecastInfo.length < limit) {
                    const date = f.dt * 1000;

                    forecastInfo.push({
                        temp: {
                            max: {
                                value: Math.round(f.temp.max),
                                unit: 'C'
                            },
                            min: {
                                value: Math.round(f.temp.min),
                                unit: 'C'
                            }
                        },
                        date: {
                            date: dayjs(date),
                            month: dayjs(date).format('MMM'),
                            dayNumber: dayjs(date).format('DD'),
                            dayWeek: dayjs(date).format('ddd')
                        },
                        icon: imageBaseUrl.replace('{icon}', f.weather[0].icon),
                        iconCode: `icon_${f.weather[0].icon}`,
                        text: capitalize(f.weather[0].description),
                        precipitationProbability: Math.round(f.pop * 100),
                        moon: {
                            phase: f.moon_phase,
                            moonRise: f.moonrise,
                            moonSet: f.moonset,
                            text: getMoonPhaseTextAndClass(f.moon_phase, translator).text,
                            class: getMoonPhaseTextAndClass(f.moon_phase, translator).class
                        },
                        isToday: now === dayjs(date).format('YYYY-MM-DD')
                    });
                }
            });
            setStorageValue(StorageKeys.forecastDaily, forecastInfo);
            setStorageValue(StorageKeys.lastUpdate.forecastDaily, Date.now());
        }
    }
    return forecastInfo;
}

function getBaseUrl(latitude, longitude) {
    const apikey = GetConfigurations().OPENWEATHERMAP_API_KEY;
    const lang = GetConfigurations().language;
    const url = `${baseUrl}?appid=${apikey}&lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}`
    consoleDebug('url', url);
    return url;
}

function getDayLigthData(sunrise, sunset, timezone) {
    let midNight = dayjs.tz(sunrise.utc(), timezone);
    midNight = midNight.set('hour', 0);
    midNight = midNight.set('minute', 0);
    midNight = midNight.set('second', 0);
    midNight = midNight.set('millisecond', 0);

    const midNightToSunrise = sunrise.diff(midNight, 'minute')

    let midDay = dayjs.tz(sunrise.utc(), timezone);
    midDay = midDay.set('hour', 12);
    midDay = midDay.set('minute', 0);
    midDay = midDay.set('second', 0);
    midDay = midDay.set('millisecond', 0);

    const sunriseToMidDay = midDay.diff(sunrise, 'minute');

    const midDayToSunset = sunset.diff(midDay, 'minute');

    let nextMidNight = dayjs.tz(sunset.utc(), timezone);
    nextMidNight = nextMidNight.add(1, 'day');
    nextMidNight = nextMidNight.set('hour', 0);
    nextMidNight = nextMidNight.set('minute', 0);
    nextMidNight = nextMidNight.set('second', 0);
    nextMidNight = nextMidNight.set('millisecond', 0);

    const sunsetToMidNight = nextMidNight.diff(sunset, 'minute');

    return [midNightToSunrise, sunriseToMidDay, midDayToSunset, sunsetToMidNight];
}