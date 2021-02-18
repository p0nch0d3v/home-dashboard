import axios from 'axios';
import moment from 'moment';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from './DataService';

const apikey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const imageBaseUrl = 'https://openweathermap.org/img/wn/{icon}@4x.png'
const units = 'metric';

export async function getLocationInfo(force = false){
    let locationInfo = getStorageValue(StorageKeys.locationInfo);
    if (locationInfo && force === false){
        return locationInfo;
    }
    else {
        locationInfo = {};
        
        const ipInfo = await axios({
            url: 'https://ipinfo.io/json',
            method: 'GET'
        }).then(r=>{
            return r.data;
        }).catch(e => { console.error(e); return null; });;

        locationInfo.ip = ipInfo.ip;
        locationInfo.city = ipInfo.city;
        locationInfo.region = ipInfo.region;
        locationInfo.timezone = ipInfo.timezone;

        const position = await getPosition();

        locationInfo.coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        setStorageValue(StorageKeys.locationInfo, locationInfo);
    }

    return locationInfo;
}

export async function getCurrentWeather(latitude, longitude, force = false) {
    let conditionsInfo = getStorageValue(StorageKeys.currentConditions);
    if (conditionsInfo && force === false){
        return conditionsInfo;
    }
    else {
        let conditions = await axios({
            method: 'GET',
            url: `${getBaseUrl(latitude, longitude)}&exclude=minutely,hourly,daily,alerts`
        }).then(r => { return r.data.current; })
        .catch(e => { console.warn(e); return null; });

        if (conditions) {
            conditionsInfo = {
                text: conditions.weather[0].main,
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
                    text: getUvIndexDescription(Math.round(conditions.uvi))
                },
                pressure: {
                    value: conditions.pressure,
                    unit: 'hPa'
                },
                wind: {
                    direction: getCardinalDirectionFromDegree(conditions.wind_deg),
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
                sunSet: conditions.sunset * 1000,
                sunRise: conditions.sunrise * 1000
            };
            setStorageValue(StorageKeys.currentConditions, conditionsInfo);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
    }
    return conditionsInfo;
}

export async function getForecastHourly(latitude, longitude, force = false) {
    let forecastInfo = getStorageValue(StorageKeys.forecastHourly);
    if (forecastInfo && force === false){
        return forecastInfo;
    }
    else {
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
                            text: getUvIndexDescription(Math.round(f.uvi))
                        },
                        icon: imageBaseUrl.replace('{icon}', f.weather[0].icon),
                        iconCode: `icon_${f.weather[0].icon}`,
                        text:  f.weather[0].main,
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

export async function getForecastDaily(latitude, longitude, force = false) {
    let forecastInfo = getStorageValue(StorageKeys.forecastDaily);
    if (forecastInfo && force === false){
        return forecastInfo;
    }
    else {
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
                        text: f.weather[0].main,
                        precipitationProbability: Math.round(f.pop * 100),
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

function getCardinalDirectionFromDegree(degree){
    var degreeAndCardinal = [];
    
    degreeAndCardinal.push({min:348.75,	max:360, dir: 'North'});
    degreeAndCardinal.push({min:0,	max:11.25, dir: 'North'});
    degreeAndCardinal.push({min:11.25,	max:33.75, dir: 'North NE'});
    
    degreeAndCardinal.push({min:33.75,	max:56.25, dir: 'North East'});
    degreeAndCardinal.push({min:56.25,	max:78.75, dir: 'East NE'});
    degreeAndCardinal.push({min:78.75,	max:101.25, dir: 'East'});
    degreeAndCardinal.push({min:101.25,	max:123.75, dir: 'East SE'});
    
    degreeAndCardinal.push({min:123.75,	max:146.25, dir: 'South East'});
    degreeAndCardinal.push({min:146.25,	max:168.75, dir: 'South SE'});
    degreeAndCardinal.push({min:168.75,	max:191.25, dir: 'South'});
    degreeAndCardinal.push({min:191.25,	max:213.75, dir: 'South SW'});
    
    degreeAndCardinal.push({min:213.75,	max:236.25, dir: 'South West'});
    degreeAndCardinal.push({min:236.25,	max:258.75, dir: 'West SW'});
    degreeAndCardinal.push({min:258.75,	max:281.25, dir: 'West'});
    degreeAndCardinal.push({min:281.25,	max:303.75, dir: 'West NW'});
    
    degreeAndCardinal.push({min:303.75,	max:326.25, dir: 'North West'});
    degreeAndCardinal.push({min:326.25,	max:348.75, dir: 'North NW'});
    
    for (let i = 0, t = degreeAndCardinal.length; i < t; i++) {
        if (degree >= degreeAndCardinal[i].min && degree <= degreeAndCardinal[i].max) {
            return degreeAndCardinal[i].dir;
        }
    } 
    return degree.toString();
}

function getUvIndexDescription(uv){
    if (uv >=0 && uv <= 2){
        return "Low";
    }
    else if (uv >= 3 && uv <= 5){
        return "Moderate";
    }
    else if (uv >= 6 && uv <= 7){
        return "High";
    }
    else if (uv >= 8 && uv <= 10){
        return "Very High";
    }
    else if (uv >= 11 ){
        return "Extreme";
    }
    else {
        return "";
    }
}

function getBaseUrl(latitude, longitude){
    return `${baseUrl}?appid=${apikey}&lat=${latitude}&lon=${longitude}&units=${units}`;
}

function getPosition(options) {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}