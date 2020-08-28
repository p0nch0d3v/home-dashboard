import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import {
    getCityInfo,
    getCurrentConditions,
    getForecastHourly12,
    getForecaseDaily5,
    getWeather,
    getForecastHourly,
    getForecaseDaily
} from '../services/AccuWeather';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from '../services/DataService';

import DateTime from './DateTime';
import WeatherCurrent from './WeatherCurrent';
import WeatherCurrentComp from './WeatherCurrentComp';
import WeatherForecastHourly from './WeatherForecastHourly';
import WeatherForecastDaily from  './WeatherForecastDaily';

class MainSlider extends Component {
    second = 1000;
    minute = this.second * 60;
    hour = this.minute * 60;
    intervals = {
        conditions : this.minute * 10,
        forecastHourly: this.minute * 20,
        forecastDaily: this.hour
    };
    currentSlider = 0;
    sliderItems = [];

    state = {
        date: null,
        time: null,
        cityKey: null,
        timeZone: {
            code: null,
            name: null
        },
        weather: {
            text: null,
            temp: {
                temp: null,
                unit: null,
            },
            humidity: null,
            feel: {
                feelTemp: null,
                feelUnit: null,
            },
            uv: {
                index: null,
                text: null
            },
            icon: null,
            pressure: {
                feelTemp: null,
                feelUnit: null,
            }
        },
        forecastHourly: [],
        forecastDaily: []
    };

    getDate = () => {
        let newDate = moment.utc().tz(this.state.timeZone.name).format('MM/DD/YYYY');
        this.setState({date: newDate});
    };

    getTime = () => {
        let newTime = moment.utc().tz(this.state.timeZone.name).format('HH:mm:ss');
        this.setState({time: newTime});
    };

    async getCity() {
        const city = 'Hermosillo, Sonora, Mexico';
        let cityInfo = getStorageValue(StorageKeys.cityInfo);

        if (!cityInfo){
          const cityInfo = await getCityInfo(city);
          setStorageValue(StorageKeys.cityInfo, cityInfo);
        }
        if (cityInfo){
          this.setState({cityKey: cityInfo.Key});
          this.setState({timeZone: { code: cityInfo.TimeZone.Code, name: cityInfo.TimeZone.Name }});
        }
    }

    async getWeatherConditions(cityKey) {
        let currentConditions = getStorageValue(StorageKeys.currentConditions);
        let lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.conditions));
        let now = moment(Date.now());

        if (!currentConditions || (now - lastUpdate) >= this.intervals.conditions) {
            currentConditions = await getCurrentConditions(cityKey);
            setStorageValue(StorageKeys.currentConditions, currentConditions);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
        if (currentConditions){
            const weather = getWeather(currentConditions);
            this.setState({ weather: weather });
        }
    }

    async getWeatherForecastHourly(cityKey) {
        let forecastHourly = getStorageValue(StorageKeys.forecastHourly);
        let lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.forecastHourly));
        let now = moment(Date.now());
        let firstHour = forecastHourly ? moment(forecastHourly[0].DateTime) : moment(null);

        if (!forecastHourly || (now - lastUpdate) >= this.intervals.forecastHourly || now >= firstHour) {
            forecastHourly = await getForecastHourly12(cityKey);
            setStorageValue(StorageKeys.forecastHourly, forecastHourly);
            setStorageValue(StorageKeys.lastUpdate.forecastHourly, Date.now());
        }
        if (forecastHourly) {
            const forecast = getForecastHourly(forecastHourly);
            this.setState({ forecastHourly: forecast });
        }
    }

    async getWeatherForecastDaily(cityKey) {
        let forecastDaily = getStorageValue(StorageKeys.forecastDaily);
        let lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.forecastDaily));
        let now = moment(Date.now());

        if (!forecastDaily || (now - lastUpdate) >= this.intervals.forecastDaily) {
            forecastDaily = await getForecaseDaily5(cityKey);
            setStorageValue(StorageKeys.forecastDaily, forecastDaily);
            setStorageValue(StorageKeys.lastUpdate.forecastDaily, Date.now());
        }
        if (forecastDaily) {
            const forecast = getForecaseDaily(forecastDaily);
            this.setState({ forecastDaily: forecast });
        }
    }

    async componentDidMount() {
        await this.getCity();
        this.getDate();
        this.getTime();
        await this.getWeatherConditions(this.state.cityKey);
        await this.getWeatherForecastHourly(this.state.cityKey);
        await this.getWeatherForecastDaily(this.state.cityKey);

        setInterval(() => {
            this.getTime();
        }, this.second);

        setInterval(() => {
            this.getDate();
        }, this.hour);

        setInterval(async ()=>{
            await this.getWeatherConditions(this.state.cityKey);
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastHourly(this.state.cityKey);
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastDaily(this.state.cityKey);
        }, this.minute);

        setInterval(() => {
            this.currentSlider = this.currentSlider + 1 < this.sliderItems.length ? this.currentSlider + 1 : 0;
        }, this.second * 20);
    }

    render(){
        this.sliderItems = [];
        this.sliderItems.push(this.state.date && this.state.time ? <DateTime date={this.state.date} time={this.state.time} /> : '');
        this.sliderItems.push(this.state.weather ? <WeatherCurrent weather={this.state.weather} /> : '');
        this.sliderItems.push(this.state.weather ? <WeatherCurrentComp weather={this.state.weather} /> : '');
        this.sliderItems.push(this.state.forecastHourly ? <WeatherForecastHourly forecast={this.state.forecastHourly} /> : '');
        this.sliderItems.push(this.state.forecastDaily ? <WeatherForecastDaily forecast={this.state.forecastDaily}/> : '');
        return (
            <div className="col-12">
                { this.sliderItems[this.currentSlider] }
            </div>
        );
    }
}

export default MainSlider;
