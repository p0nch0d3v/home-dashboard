import moment from 'moment';

import {
    getUvIndexDescription,
    getCardinalDirectionFromDegree
} from '../helpers';

const rand = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export async function getLocationInfo(force = false){
    return {
        ip: '127.0.0.1',
        city: 'city',
        region: 'region',
        timezone: 'UTC',
        coordinates: {
            latitude: 0,
            longitude: 0
        }
    };
}

export async function getCurrentWeather(latitude, longitude, force = false) {
    let weatherText = ''
    for (let i = 0; i < rand(10, 50); i++) {         
        weatherText += (i % 2) ? String.fromCharCode(rand(65, 90)) : String.fromCharCode(rand(97, 122));
    }
    return {
        text: weatherText,
        temp: {
            value: rand(0, 99),
            unit: 'C',
            formatted: `${rand(0, 99)} °C` 
        },
        humidity: rand(0, 99),
        feel: {
            value: rand(0, 99),
            unit: 'C',
            formatted : `${rand(0, 99)} °C`
        },
        iconCode: 'icon_01d',
        icon: 'https://openweathermap.org/img/wn/041@4x.png',
        uv: {
            index: rand(0, 12),
            text: getUvIndexDescription(rand(0, 12))
        },
        pressure: {
            value: rand(870, 1085),
            unit: 'hPa'
        },
        wind: {
            direction: getCardinalDirectionFromDegree(rand(0,359)),
            speed: {
                value: rand(0, 99),
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
        sunSet: Date.now(),
        sunRise: Date.now()
    };
}

export async function getForecastHourly(latitude, longitude, force = false) {
    let forecastInfo = [];

    for (let i = 0; i < 5; i++) {
        forecastInfo.push({
            temp: {
                value: rand(0, 99),
                unit: 'C'
            },
            feel: {
                value: rand(0, 99),
                unit: 'C'
            },
            dateTime: Date.now(),
            formattedDateTime: moment(Date.now()).format("hh A"),
            uv: {
                index: rand(0, 12),
                text: getUvIndexDescription(rand(0, 12))
            },
            iconCode: 'icon_01d',
            icon: 'https://openweathermap.org/img/wn/041@4x.png',
            text: '',
            precipitationProbability: rand(0, 100)
        });
    }
    return forecastInfo;
}

export async function getForecastDaily(latitude, longitude, force = false) {
    let forecastInfo = [];

    for (let i = 0; i < 6; i++) {
        let date = Date.now()
        forecastInfo.push({
            temp: {
                max: {
                    value: rand(0, 99),
                    unit: 'C'
                },
                min: {
                    value: rand(0, 99),
                    unit: 'C'
                }
            },
            date: {
                date: moment(date),
                month: moment(date).format('MMM'),
                dayNumber: moment(date).format('DD'),
                dayWeek: moment(date).format('ddd')
            },
            iconCode: 'icon_01d',
            icon: 'https://openweathermap.org/img/wn/041@4x.png',
            text: '',
            precipitationProbability: rand(0, 100),
            isToday: i === 0
        });
    }
    return forecastInfo;
}
