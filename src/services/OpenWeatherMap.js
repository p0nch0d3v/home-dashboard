import axios from 'axios';
import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from './DataService';

const apikey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall';
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
        }).then(r => { return r.data; })
        .catch(e => { console.warn(e); return null; });

        if (conditions) {
            conditionsInfo = {
                text: conditions.current.weather[0].main,
                temp: {
                    value: Math.round(conditions.current.temp),
                    unit: 'C',
                    formatted: Math.round(conditions.current.temp) + ' °C' 
                },
                humidity: conditions.current.humidity,
                feel: {
                    value: Math.round(conditions.current.feels_like),
                    unit: 'C',
                },
                icon: `http://openweathermap.org/img/wn/${conditions.current.weather[0].icon}@4x.png`,
                uv: {
                    index: Math.round(conditions.current.uvi),
                    text: getUvIndexDescription(Math.round(conditions.current.uvi))
                },
                pressure: {
                    value: conditions.current.pressure,
                    unit: 'hPa'
                },
                wind: {
                    direction: getCardinalDirectionFromDegree(conditions.current.wind_deg),
                    speed: {
                        value: Math.round(conditions.current.wind_speed * 3.6),
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
                sunSet: conditions.current.sunset * 1000,
                sunRise: conditions.current.sunrise * 1000
            };
            setStorageValue(StorageKeys.currentConditions, conditionsInfo);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
    }
    return conditionsInfo;
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