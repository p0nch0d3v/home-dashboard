import React, { Component } from 'react';
import KeyboardEventHandler from 'react-keyboard-event-handler';
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

class MainSlider extends Component {
    second = 1000;
    minute = this.second * 60;
    hour = this.minute * 60;
    intervals = {
        conditions : this.minute * 25,
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
        sunRise: null,
        sunSet: null,
        isDay: null,
        isNight: null,
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
            },
            tempMax: {
                value: null,
                unit: null
            },
            tempMin: {
                value: null,
                unit: null
            }
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
      if (this.state.timeZone.name) {
        const newMomentDate = moment.utc().tz(this.state.timeZone.name);
        const newDate = newMomentDate.format('MMM / DD / YYYY');
        const newWeekDay = newMomentDate.format('dddd');
        this.setState({date: newMomentDate});
        this.setState({formattedDate: newDate});
        this.setState({weekDay: newWeekDay});
      }
    };

    getTime = () => {
      const now = moment.utc().tz(this.state.timeZone.name);
      if (this.state.timeZone.name) {
        const newTime = now.format('HH:mm');
        this.setState({time: newTime});
      }
      if (this.state.sunRise && this.state.sunSet){
        if (now >= this.state.sunRise && now <= this.state.sunSet) {
          this.setState({ isDay: true });
          this.setState({ isNight: false });
        }
        else {
          this.setState({ isDay: false });
          this.setState({ isNight: true });
        }
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
        showDebug: (conditionsDiff >= this.intervals.conditions)
                || (forecastHourlyDiff >= this.intervals.forecastHourly)
                || (forecastDailyDiff >= this.intervals.forecastDaily)
      };

      this.setState({debug: newDebug});
    }

    keyHandker = (e) => {
      if (e.charCode === 37 || e.keyCode === 37) {
        this.moveSlider(false);
      }
      if (e.charCode === 39 || e.keyCode === 39){
        this.moveSlider(true);
      }
    }

    async getCity() {
        const city = 'Hermosillo, Sonora, Mexico';
        let cityInfoSaved = getStorageValue(StorageKeys.cityInfo);

        if (!cityInfoSaved) {
          const cityInfo = await getCityInfo(city);
          setStorageValue(StorageKeys.cityInfo, cityInfo);
        }

        cityInfoSaved = getStorageValue(StorageKeys.cityInfo);
        if (cityInfoSaved) {
          this.setState({
            city: {
              name: cityInfoSaved.LocalizedName,
              key: cityInfoSaved.Key
            }
          });
          this.setState({
            timeZone: {
              code: cityInfoSaved.TimeZone.Code,
              name: cityInfoSaved.TimeZone.Name
            }
          });
        }
        return cityInfoSaved ? cityInfoSaved.Key : null;
    }

    async getWeatherConditions(cityKey) {
      if (cityKey) {
        let currentConditionsSaved = getStorageValue(StorageKeys.currentConditions);
        const lastUpdate = moment(getStorageValue(StorageKeys.lastUpdate.conditions));
        const now = moment(Date.now());

        if (!currentConditionsSaved || (now - lastUpdate) >= this.intervals.conditions) {
            const currentConditions = await getCurrentConditions(cityKey);
            if (currentConditions) {
              setStorageValue(StorageKeys.currentConditions, currentConditions);
              setStorageValue(StorageKeys.lastUpdate.conditions, Date.now());
            }
        }

        currentConditionsSaved = getStorageValue(StorageKeys.currentConditions);
        if (currentConditionsSaved) {
          const weather = getWeather(currentConditionsSaved);
          this.setState({ weather: weather });
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
            const forecastHourly = await getForecastHourly12(cityKey);
            if (forecastHourly) {
              setStorageValue(StorageKeys.forecastHourly, forecastHourly);
              setStorageValue(StorageKeys.lastUpdate.forecastHourly, Date.now());
            }
        }

        forecastHourlySaved = getStorageValue(StorageKeys.forecastHourly);
        if (forecastHourlySaved) {
          const forecast = getForecastHourly(forecastHourlySaved, `${this.state.formattedDate} ${this.state.time}`);
          this.setState({ forecastHourly: forecast });
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
            const forecastDaily = await getForecaseDaily5(cityKey);
            if (forecastDaily) {
              setStorageValue(StorageKeys.forecastDaily, forecastDaily);
              setStorageValue(StorageKeys.lastUpdate.forecastDaily, Date.now());
            }
        }

        forecastDailySaved = getStorageValue(StorageKeys.forecastDaily);
        if (forecastDailySaved) {
          const forecast = getForecaseDaily(forecastDailySaved);
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
          this.setState({ forecastDaily: forecastArray });
        }
      }
      this.setStateDebug();
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

        document.body.addEventListener('touchstart', (e) => {
          var touchobj = e.changedTouches[0];
          this.startTouchX = parseInt(touchobj.clientX);
          e.preventDefault();
        }, false);

        document.body.addEventListener('touchend', (e) => {
          var touchobj = e.changedTouches[0];
          this.endTouchX = parseInt(touchobj.clientX);
          const diff = this.startTouchX - this.endTouchX;
          if (diff >= 600) {
            this.moveSlider(true);
          }
          else if (diff <= -600) {
            this.moveSlider(false);
          }
          this.startTouchX = null;
          e.preventDefault();
        }, false);
    }

    render = () => {
        this.sliderItems = [];
        this.sliderItems.push(
          <DateTime date={this.state.formattedDate}
                    time={this.state.time}
                    weekDay={this.state.weekDay} /> );
        this.sliderItems.push(<WeatherCurrent weather={this.state.weather} />);
        this.sliderItems.push(<WeatherCurrentComp weather={this.state.weather} />);
        this.sliderItems.push(<WeatherForecastHourly forecast={this.state.forecastHourly} />);
        this.sliderItems.push(<WeatherForecastDaily forecast={this.state.forecastDaily}/>);
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

