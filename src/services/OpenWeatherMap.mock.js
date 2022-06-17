import moment from 'moment';

import {
    getUvIndexDescription,
    getCardinalDirectionFromDegree,
    rand,
    getRandomText,
    getMoonPhaseTextAndClass
} from '../helpers';

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

export async function getCurrentWeather(latitude, longitude, translator, force = false) {
    return {
        text: getRandomText(10, 50),
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
            text: getUvIndexDescription(rand(0, 12), translator)
        },
        pressure: {
            value: rand(870, 1085),
            unit: 'hPa'
        },
        wind: {
            direction: getCardinalDirectionFromDegree(rand(0,359), translator),
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
        sunset: Date.now(),
        sunrise: Date.now(),
        dayLight: Date.now(),
        formattedDayLight: `${rand(0, 12)}:${rand(0, 59)}`
    };
}

export async function getForecastHourly(latitude, longitude, translator, force = false) {
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
                text: getUvIndexDescription(rand(0, 12), translator)
            },
            iconCode: 'icon_01d',
            icon: 'https://openweathermap.org/img/wn/041@4x.png',
            text: getRandomText(10, 50),
            precipitationProbability: rand(0, 100)
        });
    }
    return forecastInfo;
}

export async function getForecastDaily(latitude, longitude, localeLang, translator, force = false) {
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
            text: getRandomText(10, 50),
            precipitationProbability: rand(0, 100),
            moon: {
                phase: rand(0, 100) / 100,
                moonRise: Date.now(),
                moonSet: Date.now(),
                text: getMoonPhaseTextAndClass(rand(0, 100) / 100, translator).text,
                class: getMoonPhaseTextAndClass(rand(0, 100) / 100, translator).class,
            },
            isToday: i === 0
        });
    }
    return forecastInfo;
}

