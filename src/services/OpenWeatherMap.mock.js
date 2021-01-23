import moment from 'moment';

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
    return {
        text: 'Weather',
        temp: {
            value: 99,
            unit: 'C',
            formatted: '99' + ' °C' 
        },
        humidity: 99,
        feel: {
            value: 98,
            unit: 'C',
        },
        icon: '',
        uv: {
            index: 12,
            text: getUvIndexDescription(12)
        },
        pressure: {
            value: 1010,
            unit: 'hPa'
        },
        wind: {
            direction: getCardinalDirectionFromDegree(180),
            speed: {
                value: 999,
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
                value: 999,
                unit: 'C'
            },
            feel: {
                value: 999,
                unit: 'C'
            },
            dateTime: Date.now(),
            formattedDateTime: moment(Date.now()).format("hh A"),
            uv: {
                index: 12,
                text: getUvIndexDescription(12)
            },
            icon: '',
            text:  '',
            precipitationProbability: 100
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
                    value: 999,
                    unit: 'C'
                },
                min: {
                    value: 999,
                    unit: 'C'
                }
            },
            date: {
                date: moment(date),
                month: moment(date).format('MMM'),
                dayNumber: moment(date).format('DD'),
                dayWeek: moment(date).format('ddd')
            },
            icon: '',
            text: '',
            precipitationProbability: 100,
            isToday: i === 0
        });
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
