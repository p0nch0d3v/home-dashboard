import moment from 'moment';

import {
    getUvIndexDescription,
    getCardinalDirectionFromDegree,
    rand,
    getRandomText,
    getMoonPhaseTextAndClass,
    getUvIndexColor
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
    let conditionsInfo = {
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
            text: getUvIndexDescription(rand(   0, 12), translator),
            color: getUvIndexColor(rand(0, 12))
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
        sunset: moment.utc(Date.now()),
        sunrise: moment.utc(Date.now())
    };

    conditionsInfo.formattedSunset = moment.tz(conditionsInfo.sunset.utc(), 'UTC').format('hh:mm A');
    conditionsInfo.formattedSunrise = moment.tz(conditionsInfo.sunrise.utc(), 'UTC').format('hh:mm A');

    conditionsInfo.dayLight = (conditionsInfo.sunset - conditionsInfo.sunrise);

    const sunrise =  moment.tz(conditionsInfo.sunrise.utc(), 'UTC');
    const sunset =  moment.tz(conditionsInfo.sunset.utc(), 'UTC'); 

    let dayLight = sunset.subtract(sunrise.hours(), 'hours');
    dayLight = dayLight.subtract(sunrise.minutes(), 'minutes');
    dayLight = dayLight.subtract(sunrise.seconds(), 'seconds')
    conditionsInfo.formattedDayLight = dayLight.format("HH:mm");

    return conditionsInfo;
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
                text: getUvIndexDescription(rand(0, 12), translator),
                color: getUvIndexColor(rand(0, 12))
            },
            icon: 'https://openweathermap.org/img/wn/041@4x.png',
            iconCode: 'icon_01d',
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
            icon: 'https://openweathermap.org/img/wn/041@4x.png',
            iconCode: 'icon_01d',
            text: getRandomText(10, 50),
            precipitationProbability: rand(0, 100),
            moon: {
                phase: rand(0, 100) / 100,
                moonRise: Date.now(),
                moonSet: Date.now(),
                text: getMoonPhaseTextAndClass(rand(0, 100) / 100, translator).text,
                class: getMoonPhaseTextAndClass(rand(0, 100) / 100, translator).class,
                percentage: rand(0.1, 0.9),
                moon_phase: rand(0.1, 0.9)
            },
            isToday: i === 0
        });
    }
    return forecastInfo;
}

