import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

import './MainSlider.scss';

import {
    getCityInfo,
    getCurrentConditions,
    getForecastHourly12,
    getForecaseDaily5,
    getWeather,
    getForecastHourly,
    getForecaseDaily
} from '../../services/AccuWeather';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from '../../services/DataService';

import DateTime from '../DateTime/DateTime';
import WeatherCurrent from '../WeatherCurrent/WeatherCurrent';
import WeatherCurrentComp from '../WeatherCurrentComp/WeatherCurrentComp';
import WeatherForecastHourly from '../WeatherForecastHourly/WeatherForecastHourly';
import WeatherForecastDaily from  '../WeatherForecastDaily/WeatherForecastDaily';
import DebugInfo from '../DebugInfo/DebugInfo';

class MainSlider extends Component {
    second = 1000;
    minute = this.second * 60;
    hour = this.minute * 60;
    intervals = {
        conditions : this.minute * 20,
        forecastHourly: this.hour,
        forecastDaily: this.hour
    };
    currentSlider = 0;
    sliderItems = [];
    sliderInternval = null;

    state = {
        date: null,
        formattedDate: null,
        time: null,
        weekDay: null,
        sunRise: null,
        sunSet: null,
        city: {
          key: null,
          name: null
        },
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
            },
            wind: {
                direction: null,
                speed: {
                    value: null,
                    unit: null
                }
            }
        },
        forecastHourly: [],
        forecastDaily: [],
        debug: {
          lastUpdate: {
            conditions: null,
            forecastHourly: null,
            forecastDaily: null
          }
        }
    };

    getDate = () => {
      if (this.state.timeZone.name) {
        const newMomentDate = moment.utc().tz(this.state.timeZone.name);
        const newDate = newMomentDate.format('MMM/DD/YYYY');
        const newWeekDay = newMomentDate.format('dddd');
        this.setState({date: newMomentDate});
        this.setState({formattedDate: newDate});
        this.setState({weekDay: newWeekDay});
      }
    };

    getTime = () => {
      if (this.state.timeZone.name) {
        const newTime = moment.utc().tz(this.state.timeZone.name).format('HH:mm:ss');
        this.setState({time: newTime});
      }
    };

    setSliderInterval = () => {
      if (this.sliderInternval) {
        clearInterval(this.sliderInternval);
      }
      this.sliderInternval = setInterval(() => {
        this.moveSlider(true);
      }, this.second * 20);
    }

    moveSlider = (forward) => {
      if (forward) {
        this.currentSlider = (this.currentSlider + 1) < this.sliderItems.length ? (this.currentSlider + 1) : 0;
      }
      else {
        this.currentSlider = (this.currentSlider - 1) >= 0 ? (this.currentSlider - 1) : (this.sliderItems.length - 1);
      }
      this.setSliderInterval();
    }

    setStateDebug = () => {
      const format = 'YYYY-MM-DD HH:mm:ss.SSS';
      const newDebug = {
        lastUpdate: {
          conditions: moment(getStorageValue(StorageKeys.lastUpdate.conditions)).format(format),
          forecastHourly: moment(getStorageValue(StorageKeys.lastUpdate.forecastHourly)).format(format),
          forecastDaily: moment(getStorageValue(StorageKeys.lastUpdate.forecastDaily)).format(format)
        }
      };
      this.setState({debug: newDebug});
    }

    async getCity() {
        const city = '';
        let cityInfo = getStorageValue(StorageKeys.cityInfo);

        if (!cityInfo) {
          cityInfo = await getCityInfo(city);
          setStorageValue(StorageKeys.cityInfo, cityInfo);
        }
        if (cityInfo) {
          this.setState({
            city: {
              name: cityInfo.LocalizedName,
              key: cityInfo.Key
            }
          });
          this.setState({
            timeZone: {
              code: cityInfo.TimeZone.Code,
              name: cityInfo.TimeZone.Name
            }
          });
        }
        return cityInfo.Key;
    }

    async getWeatherConditions(cityKey) {
      if (cityKey) {
        let currentConditions = getStorageValue(StorageKeys.currentConditions);
        let lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.conditions));
        let now = moment(Date.now());

        if (!currentConditions || (now - lastUpdate) >= this.intervals.conditions) {
            currentConditions = await getCurrentConditions(cityKey);
            setStorageValue(StorageKeys.currentConditions, currentConditions);
            setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
        }
        if (currentConditions) {
            const weather = getWeather(currentConditions);
            this.setState({ weather: weather });
        }
        this.setStateDebug();
      }
    }

    async getWeatherForecastHourly(cityKey) {
      if (cityKey) {
        let forecastHourly = getStorageValue(StorageKeys.forecastHourly);
        const lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.forecastHourly));
        const now = moment(Date.now());

        if (!forecastHourly || ((now - lastUpdate) >= this.intervals.forecastHourly)) {
            forecastHourly = await getForecastHourly12(cityKey);
            setStorageValue(StorageKeys.forecastHourly, forecastHourly);
            setStorageValue(StorageKeys.lastUpdate.forecastHourly, Date.now());
        }
        if (forecastHourly) {
            const forecast = getForecastHourly(forecastHourly, `${this.state.formattedDate} ${this.state.time}`);
            this.setState({ forecastHourly: forecast });
        }
        this.setStateDebug();
      }
    }

    async getWeatherForecastDaily(cityKey) {
      if (cityKey) {
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
            const today = forecast.find(f => f.date.date.format('MM/DD/YYYY') === this.state.date.format('MM/DD/YYYY'));
            if (today) {
              this.setState({ sunRise: today.sunRise });
              this.setState({ sunSet: today.sunSet });
            }
            this.setState({ forecastDaily: forecast });
        }
        this.setStateDebug();
      }
    }

    async componentDidMount() {
        const cityKey = await this.getCity();
        this.getDate();
        this.getTime();
        await this.getWeatherConditions(cityKey);
        await this.getWeatherForecastHourly(cityKey);
        await this.getWeatherForecastDaily(cityKey);

        setInterval(() => {
            this.getTime();
        }, this.second);

        setInterval(() => {
            this.getDate();
        }, this.hour);

        setInterval(async ()=>{
            await this.getWeatherConditions(cityKey);
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastHourly(cityKey);
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastDaily(cityKey);
        }, this.minute);

        this.setSliderInterval();
    }

    render = () => {
        this.sliderItems = [];
        if (this.state.date) {
          this.sliderItems.push(
            <DateTime date={this.state.formattedDate}
                      time={this.state.time}
                      weekDay={this.state.weekDay} /> );
        }
        if (this.state.weather) {
          this.sliderItems.push(<WeatherCurrent weather={this.state.weather} 
                                                sunRise={this.state.sunRise} 
                                                sunSet={this.state.sunSet} />);
          this.sliderItems.push(<WeatherCurrentComp weather={this.state.weather} />);
        }
        if (this.state.forecastHourly) {
          this.sliderItems.push(<WeatherForecastHourly forecast={this.state.forecastHourly} />);
        }
        if (this.state.forecastDaily) {
           this.sliderItems.push(<WeatherForecastDaily forecast={this.state.forecastDaily}/>);
        }
        // if (this.state.debug) {
        //   this.sliderItems.push(<DebugInfo debug={this.state.debug} />);
        // }

        return (
          <div className="container-fliud">
            <div className="mainSlider row m-0">
              <div className="col-1 mainSlider_left"
                   onClick={() => { this.moveSlider(false) }}>&lt;</div>
              <div className="col-10 content">
                  { this.sliderItems[this.currentSlider] }
              </div>
              <div className="col-1 mainSlider_right"
                   onClick={() => { this.moveSlider(true) }}> &gt;</div>
            </div>
          </div>
        );
    }
}

export default MainSlider;
