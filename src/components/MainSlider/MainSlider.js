import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import moment from 'moment';
import 'moment-timezone';

import './MainSlider.scss';
import {
  getLocationInfo,
  getCurrentWeather
} from '../../services/OpenWeatherMap';

/*import {
    getCityInfo,
    getCurrentConditions,
    getForecastHourly12,
    getForecaseDaily5,
    getWeather,
    getForecastHourly,
    getForecaseDaily
} from '../../services/AccuWeather';*/

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
import MainHeader from '../MainHeader/MainHeader';

class MainSlider extends Component {
    second = 1000;
    minute = this.second * 60;
    hour = this.minute * 60;
    intervals = {
        conditions : this.minute * 20,
        forecastHourly: this.hour * 2,
        forecastDaily: this.hour * 2
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
      /*const now = moment(new Date());

      const conditionsDiff = now - getStorageValue(StorageKeys.lastUpdate.conditions);
      const forecastHourlyDiff = now - getStorageValue(StorageKeys.lastUpdate.forecastHourly);
      const forecastDailyDiff = now - getStorageValue(StorageKeys.lastUpdate.forecastDaily);

      const newDebug = {
        lastUpdate: {
          conditions: moment(conditionsDiff).format('mm:ss'),
          forecastHourly: moment(forecastHourlyDiff).format('mm:ss'),
          forecastDaily: moment(forecastDailyDiff).format('mm:ss')
        },
        showDebug: (conditionsDiff >= this.intervals.conditions)
                || (forecastHourlyDiff >= this.intervals.forecastHourly)
                || (forecastDailyDiff >= this.intervals.forecastDaily)
      };

      this.setState({debug: newDebug});*/
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
      console.debug(now);
      console.debug(moment(lastUpdate));
      console.debug(now - moment(lastUpdate));
      if (force || (now - moment(lastUpdate)) >= this.intervals.conditions) {
        const currentWeather = await getCurrentWeather(this.state.location.coordinates.latitude, this.state.location.coordinates.longitude, force);
        if (currentWeather){
          this.setState({weather: currentWeather});
          this.setBackgroundColor();
        }
      }
     
      this.setStateDebug();
    }

    async getWeatherForecastHourly(cityKey) {
      if (cityKey) {
        let forecastHourlySaved = getStorageValue(StorageKeys.forecastHourly);
        const lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.forecastHourly));
        const now = moment(Date.now());

        if (!forecastHourlySaved || ((now - lastUpdate) >= this.intervals.forecastHourly)) {
            /*const forecastHourly = await getForecastHourly12(cityKey);
            if (forecastHourly) {
              setStorageValue(StorageKeys.forecastHourly, forecastHourly);
              setStorageValue(StorageKeys.lastUpdate.forecastHourly, Date.now());
            }*/
        }

        forecastHourlySaved = getStorageValue(StorageKeys.forecastHourly);
        if (forecastHourlySaved) {
          /*const forecast = getForecastHourly(forecastHourlySaved, `${this.state.formattedDate} ${this.state.time}`);
          this.setState({ forecastHourly: forecast });*/
        }
      }
      this.setStateDebug();
    }

    async getWeatherForecastDaily(cityKey) {
      if (cityKey) {
        let forecastDailySaved = getStorageValue(StorageKeys.forecastDaily);
        let lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.forecastDaily));
        let now = moment(Date.now());

        if (!forecastDailySaved || (now - lastUpdate) >= this.intervals.forecastDaily) {
            /*const forecastDaily = await getForecaseDaily5(cityKey);
            if (forecastDaily) {
              setStorageValue(StorageKeys.forecastDaily, forecastDaily);
              setStorageValue(StorageKeys.lastUpdate.forecastDaily, Date.now());
            }*/
        }

        forecastDailySaved = getStorageValue(StorageKeys.forecastDaily);
        if (forecastDailySaved) {
          /*const forecast = getForecaseDaily(forecastDailySaved);
          let today =  forecast.find(f => f.date.date.format('MM/DD/YYYY') === this.state.date.format('MM/DD/YYYY'));
          let forecastArray = forecast.filter(f => f.date.date.format('MM/DD/YYYY') !== this.state.date.format('MM/DD/YYYY'))
          if (today) {
            this.setState({ sunRise: today.sunRise });
            this.setState({ sunSet: today.sunSet });
            let currentWeather = this.state.weather;
            currentWeather.tempMax = today.temp.max;
            currentWeather.tempMin = today.temp.min;
            currentWeather.precipitationProbability = today.precipitationProbability;
            this.setState({ weather: currentWeather });
          }
          this.setState({ forecastDaily: forecastArray });*/
        }
      }
      this.setStateDebug();
    }

    async componentDidMount() {
        await this.getLocation(true);
        this.getDate();
        this.getTime();
        await this.getWeatherConditions(true);
        // await this.getWeatherForecastHourly(cityKey);
        // await this.getWeatherForecastDaily(cityKey);

        setInterval(() => {
            this.getTime();
        }, this.second);

        setInterval(() => {
            this.getDate();
        }, this.minute);

        setInterval(async ()=>{
            await this.getWeatherConditions();
        }, this.minute);

        /*setInterval(async () => {
            await this.getWeatherForecastHourly(cityKey);
        }, this.minute);

        setInterval(async () => {
            await this.getWeatherForecastDaily(cityKey);
        }, this.minute);

        this.setSliderInterval();*/

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
    }

    render = () => {
        this.sliderItems = [];
        this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted} />
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
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherCurrentComp weather={this.state.weather} />
          </div>
          );
        /*this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherForecastHourly forecast={this.state.forecastHourly} />
          </div>
          );*/
        /*this.sliderItems.push(
          <div>
            <MainHeader temp={this.state.weather.temp.formatted}
                        date={this.state.formattedDate}
                        time={this.state.time} />
            <WeatherForecastDaily forecast={this.state.forecastDaily}/>
          </div>
          );*/
        /*if (this.state.debug.showDebug) {
          this.sliderItems.push(
            <div className="text-center" style={{fontSize:'10vw'}}>
              <span>Conditions: {this.state.debug.lastUpdate.conditions}</span>
              <br/>
              <span>Hourly: {this.state.debug.lastUpdate.forecastHourly}</span>
              <br/>
              <span>Daily: {this.state.debug.lastUpdate.forecastDaily}</span>
            </div>
          );
        }*/

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

