import axios from 'axios';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/dist/locale/es';
import 'moment-timezone';

import {
    getUvIndexDescription,
    getCardinalDirectionFromDegree,
    consoleDebug,
    capitalize,
    getMoonPhaseTextAndClass,
    getUvIndexColor
} from '../helpers';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from './DataService';

import { GetConfigurations } from './ConfigService';

const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const imageBaseUrl = 'https://openweathermap.org/img/wn/{icon}@4x.png'
const units = 'metric';

export async function getLocationInfo(force = false){
    let locationInfo = getStorageValue(StorageKeys.locationInfo, StorageKeys.local);
    if (locationInfo && force === false) {
        return locationInfo;
    }
    else {
        consoleDebug('Calling Location Info');
        locationInfo = {};
        const ipInfo = await getipInfo(force);

        locationInfo.ip = ipInfo.ip;
        locationInfo.city = ipInfo.city;
        locationInfo.region = ipInfo.region;
        locationInfo.timezone = ipInfo.timezone;

        const position = await getPosition();

        locationInfo.coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        setStorageValue(StorageKeys.locationInfo, locationInfo, StorageKeys.local);
    }

    return locationInfo;
}

export async function getCurrentWeather(latitude, longitude, translator, force = false) {
    moment.locale(GetConfigurations().language);
    let conditionsInfo = getStorageValue(StorageKeys.currentConditions);
    if (conditionsInfo && force === false){
        return conditionsInfo;
    }
    else if (latitude && longitude){
        consoleDebug('Calling Current Weather');
        const url = `${getBaseUrl(latitude, longitude)}&exclude=minutely,hourly,daily,alerts`;
        let conditions = await axios({
            method: 'GET',
            url: url
        }).then(r => { return  {...r.data.current, timezone: r.data.timezone}; })
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
                sunset:  moment.utc(conditions.sunset, 'X', true),
                sunrise: moment.utc(conditions.sunrise, 'X', true),
                
            };
            conditionsInfo.formattedSunset = moment.tz(conditionsInfo.sunset.utc(), conditions.timezone).format('hh:mm A');
            conditionsInfo.formattedSunrise = moment.tz(conditionsInfo.sunrise.utc(), conditions.timezone).format('hh:mm A');

            conditionsInfo.dayLight = (conditionsInfo.sunset - conditionsInfo.sunrise);
            
            const sunrise =  moment.tz(conditionsInfo.sunrise.utc(), conditions.timezone);
            const sunset =  moment.tz(conditionsInfo.sunset.utc(), conditions.timezone); 

            let dayLight = sunset.subtract(sunrise.hours(), 'hours');
            dayLight = dayLight.subtract(sunrise.minutes(), 'minutes');
            dayLight = dayLight.subtract(sunrise.seconds(), 'seconds')
            conditionsInfo.formattedDayLight = dayLight.format("HH:mm");

            setStorageValue(StorageKeys.currentConditions, conditionsInfo);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
    }
    return conditionsInfo;
}

export async function getForecastHourly(latitude, longitude, translator, force = false) {
    moment.locale(GetConfigurations().language);
    let forecastInfo = getStorageValue(StorageKeys.forecastHourly);
    if (forecastInfo && force === false){
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
                if (dateTime > now && forecastInfo.length < limit){
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
                        formattedDateTime: moment(dateTime).format("hh A"),
                        uv: {
                            index: Math.round(f.uvi),
                            text: getUvIndexDescription(Math.round(f.uvi), translator),
                            color: getUvIndexColor(Math.round(f.uvi))
                        },
                        icon: imageBaseUrl.replace('{icon}', f.weather[0].icon),
                        iconCode: `icon_${f.weather[0].icon}`,
                        text:  capitalize(f.weather[0].description),
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
    moment.locale(GetConfigurations().language);
    let forecastInfo = getStorageValue(StorageKeys.forecastDaily);
    if (forecastInfo && force === false){
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
            const now = moment(Date.now()).format('YYYY-MM-DD');

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
                            date: moment(date),
                            month: moment(date).format('MMM'),
                            dayNumber: moment(date).format('DD'),
                            dayWeek: moment(date).format('ddd')
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
                            class: getMoonPhaseTextAndClass(f.moon_phase, translator).class,
                            percentage: (((f.moon_phase < 0.5 ? f.moon_phase : 1 - f.moon_phase) * 2) * 100).toFixed(0)
                        },
                        isToday: now === moment(date).format('YYYY-MM-DD')
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

function getPosition(options) {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}

async function getipInfo(force) {
    let ipInfo = getStorageValue(StorageKeys.ipInfo, StorageKeys.local);
    if (!ipInfo || force === true) {
        consoleDebug('Calling Ip Info');  
        const ipinfoApiKey = GetConfigurations().IPINFO_API_KEY;
        const url = `https://ipinfo.io?token=${ipinfoApiKey}`
        consoleDebug('getipInfo', 'url', url);
        ipInfo = await axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "application/json"  
            }
        }).then(r => {
            return r.data;
        }).catch(e => { 
            console.error(e); return null; 
        });
        setStorageValue(StorageKeys.ipInfo, ipInfo, StorageKeys.local);
    }
    return ipInfo
}