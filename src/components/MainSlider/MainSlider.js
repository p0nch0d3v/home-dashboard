import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import moment from 'moment';
import 'moment-timezone';

import {
  getLocationInfo,
  getCurrentWeather,
  getForecastHourly,
  getForecastDaily
} from '../../services/OpenWeatherMap';

import {
    StorageKeys,
    getStorageValue
} from '../../services/DataService';

import DateTime from '../DateTime/DateTime';
import WeatherCurrent from '../WeatherCurrent/WeatherCurrent';
import WeatherCurrentComp from '../WeatherCurrentComp/WeatherCurrentComp';
import WeatherForecastHourly from '../WeatherForecastHourly/WeatherForecastHourly';
import WeatherForecastDaily from  '../WeatherForecastDaily/WeatherForecastDaily';
import MainHeader from '../MainHeader/MainHeader';

class MainSlider extends Component {
    second = 1000;
    minute = this.second * 60;
    hour = this.minute * 60;
    intervals = {
        conditions : this.minute * 10,
        forecastHourly: this.hour,
        forecastDaily: this.hour
    };
    currentSlider = 0;
    sliderItems = [];
    sliderInternval = null;
    startTouchX = null;
    endTouchX = null;

    state = {
        date: null,
        formattedDate: null,
        time: null,
        weekDay: null,
        isDay: null,
        isNight: null,
        location: {
            ip: null,
            city: null,
            region: null,
            timezone: null,
            coordinates: {
              latitude:null,
              longitude:null
            }
        },
        weather: {
            text: null,
            temp: {
                temp: null,
                unit: null,
                formatted: null
            },
            humidity: null,
            feel: {
                feelTemp: null,
                feelUnit: null,
                formatted: null
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
            },
            tempMax: {
                value: null,
                unit: null
            },
            tempMin: {
                value: null,
                unit: null
            },
            sunRise: null,
            sunSet: null
        },
        forecastHourly: [],
        forecastDaily: [],
        debug: {
          lastUpdate: {
            conditions: null,
            forecastHourly: null,
            forecastDaily: null
          },
          showDebug: false
        }
    };

    getDate = () => {
      if (this.state.location.timezone) {
        const newMomentDate = moment.utc().tz(this.state.location.timezone);
        const newDate = newMomentDate.format('DD / MMM / YYYY');
        const newWeekDay = newMomentDate.format('dddd');
        this.setState({date: newMomentDate});
        this.setState({formattedDate: newDate});
        this.setState({weekDay: newWeekDay});
      }
    };

    getTime = () => {
      if (this.state.location.timezone) {
        const now = moment.utc().tz(this.state.location.timezone);
        const newTime = now.format('hh:mm A');
        this.setState({time: newTime});
        
        this.setBackgroundColor();
      }
    };

    setBackgroundColor = () => {
      const now = moment.utc().tz(this.state.location.timezone);
      if (this.state.weather.sunRise && this.state.weather.sunSet){
        if (now >= moment(this.state.weather.sunRise) && now <= moment(this.state.weather.sunSet)) {
          this.setState({ isDay: true });
          this.setState({ isNight: false });
        }
        else {
          this.setState({ isDay: false });
          this.setState({ isNight: true });
        }
      }
    }

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
      const now = moment(new Date());

      const conditionsDiff = now - getStorageValue(StorageKeys.lastUpdate.conditions);
      const forecastHourlyDiff = now - getStorageValue(StorageKeys.lastUpdate.forecastHourly);
      const forecastDailyDiff = now - getStorageValue(StorageKeys.lastUpdate.forecastDaily);

      const newDebug = {
        lastUpdate: {
          conditions: moment(conditionsDiff).format('mm:ss'),
          forecastHourly: moment(forecastHourlyDiff).format('mm:ss'),
          forecastDaily: moment(forecastDailyDiff).format('mm:ss')
        },
        showDebug: (conditionsDiff > (this.intervals.conditions + this.minute))
                || (forecastHourlyDiff > (this.intervals.forecastHourly + this.minute))
                || (forecastDailyDiff > (this.intervals.forecastDaily + this.minute))
      };

      this.setState({ debug: newDebug });
    }

    keyHandker = (e) => {
      if (e.charCode === 37 || e.keyCode === 37) {
        this.moveSlider(false);
      }
      if (e.charCode === 39 || e.keyCode === 39){
        this.moveSlider(true);
      }
    }

    async getLocation() {
      const locationInfo = await getLocationInfo();
      if (locationInfo) {
        this.setState({
          location: locationInfo
        });
      }
    }

    async getWeatherConditions(force = false) {
      const lastUpdate = getStorageValue(StorageKeys.lastUpdate.conditions);
      const now = moment(Date.now());
      force = force || (now - moment(lastUpdate)) >= this.intervals.conditions;

      const currentWeather = await getCurrentWeather(this.state.location.coordinates.latitude, this.state.location.coordinates.longitude, force);
      if (currentWeather) {
        
        if (this.state.weather.tempMax || this.state.weather.tempMin || this.state.weather.precipitationProbability){
          currentWeather.tempMax = this.state.weather.tempMax;
          currentWeather.tempMin = this.state.weather.tempMin;
          currentWeather.precipitationProbability = this.state.weather.precipitationProbability;
        }

        this.setState({weather: currentWeather});
        this.setBackgroundColor();
      }
      this.setStateDebug();
    }

    async getWeatherForecastHourly(force = false) {
      const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastHourly);
      const now = moment(Date.now());
      force = force || (now - moment(lastUpdate)) >= this.intervals.forecastHourly;
      if (this.state.forecastHourly && this.state.forecastHourly.length > 0){
        force = force || Date.now() > this.state.forecastHourly[0].dateTime;
      }
      
      const forecast = await getForecastHourly(this.state.location.coordinates.latitude, this.state.location.coordinates.longitude, force);
      if (forecast){
        this.setState({ forecastHourly: forecast });
      }
      this.setStateDebug();
    }

    async getWeatherForecastDaily(force = false) {
      const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastDaily);
      const now = moment(Date.now());
      force = force || (now - moment(lastUpdate)) >= this.intervals.forecastDaily;
      
      if (this.state.forecastDaily && this.state.forecastDaily.length > 0){
        force = force || !(moment(Date.now()).format('YYYY-MM-DD') === moment(this.state.forecastHourly[0].dateTime).format('YYYY-MM-DD'));
      }

      let forecast = await getForecastDaily(this.state.location.coordinates.latitude, this.state.location.coordinates.longitude, force);
      if (forecast) {
        const todayForecast = forecast.find(f => f.isToday === true)
        
        forecast = forecast.filter(f => f.isToday === false);
        this.setState({ forecastDaily: forecast });
        
        if (todayForecast) {
          let currentWeather = this.state.weather;
          currentWeather.tempMax = todayForecast.temp.max;
          currentWeather.tempMin = todayForecast.temp.min;
          currentWeather.precipitationProbability = todayForecast.precipitationProbability;
          this.setState({ weather: currentWeather });
        }
      }
      this.setStateDebug();
    }

    async componentDidMount() {
        await this.getLocation(true);
        this.getDate();
        this.getTime();
        await this.getWeatherConditions(true);
        await this.getWeatherForecastHourly(true);
        await this.getWeatherForecastDaily(true);
        this.setStateDebug();

        setInterval(() => {
            this.getTime();
        }, this.second);

        setInterval(() => {
            this.getDate();
        }, this.minute);

        setInterval(async ()=>{
            await this.getWeatherConditions();
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastHourly();
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastDaily();
        }, this.minute);

        this.setSliderInterval();

        document.body.addEventListener('touchstart', (e) => {
          var touchobj = e.changedTouches[0];
          this.startTouchX = parseInt(touchobj.clientX);
          e.preventDefault();
        }, false);

        document.body.addEventListener('touchend', (e) => {
          var touchobj = e.changedTouches[0];
          this.endTouchX = parseInt(touchobj.clientX);
          const diff = this.startTouchX - this.endTouchX;
          if (diff >= 500) {
            this.moveSlider(true);
          }
          else if (diff <= -500) {
            this.moveSlider(false);
          }
          this.startTouchX = null;
          e.preventDefault();
        }, false);

        document.querySelector('.main-header').addEventListener('touchend', (e) => {
          var el = document.documentElement;
          if (document.fullscreen && document.fullscreenEnabled){
            document.exitFullscreen();
          }
          else {
            var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
            rfs.call(el);
          }
        });
    }

    render = () => {
        this.sliderItems = [];
        this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        feelTemp={this.state.weather.feel.formatted} />
            <DateTime date={this.state.formattedDate}
                      time={this.state.time}
                      weekDay={this.state.weekDay} /> 
          </div>
          );
        this.sliderItems.push(
          <div>
            <MainHeader date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherCurrent weather={this.state.weather} />
          </div>
          );
        this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        feelTemp={this.state.weather.feel.formatted}
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherCurrentComp weather={this.state.weather} />
          </div>
          );
        this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        feelTemp={this.state.weather.feel.formatted}
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherForecastHourly forecast={this.state.forecastHourly} />
          </div>
          );
        this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        feelTemp={this.state.weather.feel.formatted}
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherForecastDaily forecast={this.state.forecastDaily}/>
          </div>
          );
        if (this.state.debug.showDebug) {
          this.sliderItems.push(
            <div className="text-center" style={{fontSize:'10vw'}}>
              <span>Conditions: {this.state.debug.lastUpdate.conditions}</span>
              <br/>
              <span>Hourly: {this.state.debug.lastUpdate.forecastHourly}</span>
              <br/>
              <span>Daily: {this.state.debug.lastUpdate.forecastDaily}</span>
            </div>
          );
        }

        const backgroundColor = this.state.isDay === true ? 'day' : (this.state.isNight === true ? 'night' : null)

        return (
          <div className={'container-fliud m-0 p-0 ' + backgroundColor} onKeyDown={this.keyHandker}>
            <div className="mainSlider row m-0 p-0">
              <div className="col-12 m-0 p-0 content">
                  { this.sliderItems[this.currentSlider] }
              </div>
            </div>
            <KeyboardEventHandler handleKeys={['left', 'right']}
                                  onKeyEvent={(key, e) => this.keyHandker(e)} />
          </div>

        );
    }
}

export default MainSlider;

