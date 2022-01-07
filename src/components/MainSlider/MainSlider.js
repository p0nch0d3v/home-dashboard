import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';
import { useTranslation } from 'react-i18next'
import { capitalize, consoleDebug, useInterval } from '../../helpers';

import {
  getLocationInfo,
  getCurrentWeather,
  getForecastHourly,
  getForecastDaily
} from '../../services/OpenWeatherMap';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from '../../services/DataService';

import { getExchangeRate } from '../../services/ExchangeRate';

import DateTime from '../DateTime/DateTime';
import WeatherCurrent from '../WeatherCurrent/WeatherCurrent';
import WeatherCurrentComp from '../WeatherCurrentComp/WeatherCurrentComp';
import WeatherForecastHourly from '../WeatherForecastHourly/WeatherForecastHourly';
import WeatherForecastDaily from  '../WeatherForecastDaily/WeatherForecastDaily';
import ExchangeRate from '../ExchangeRate/ExchangeRate';
import Calendar from '../Calendar/Calendar';
import MainHeader from '../MainHeader/MainHeader';

export default function MainSlider(props) {
  const [localeLang] = useState(process.env.REACT_APP_LOCALE_LANG || 'en');
  const [backgroundColor, set_backgroundColor] = useState('none');
  const [second] =  useState(1000);
  const [minute] = useState(second * 60);
  const [hour] = useState(minute * 60);

  const [intervals] = useState({
    conditions : minute * 10,
    forecastHourly: hour,
    forecastDaily: hour,
    exchangeRate: hour * 6
  });
  const [currentSlider, set_currentSlider] = useState(0);
  const [sliderItems, set_sliderItems] = useState([]);
  const [sliderTimes, set_sliderTimes] = useState([]);
  const [sliderTime, set_sliderTime] = useState(5 * second);
  const [touchDiff, set_touchDiff] = useState(null);

  const [date, set_date]= useState(null);
  const [formattedDate, set_formattedDate]= useState(null);
  const [time, set_time]= useState(null);
  const [weekDay, set_weekDay]= useState(null);
  const [isDay, set_isDay]= useState(null);
  const [isNight, set_isNight]= useState(null);

  const [location, set_location] = useState(null);
  const [weather, set_weather] = useState(null);
  const [currentForecast, set_currentForecast] = useState(null);
  const [forecastHourly, set_forecastHourly] = useState([]);
  const [forecastDaily, set_forecastDaily] = useState([]);
  const [exchangeRates, set_exchangeRates] = useState([]);

  const { t } = useTranslation();

  // const [debug, set_debug] = useState({});

  /* FUNCTIONS */

  const set = (callback, timeout = 250) => {
    setTimeout(() => {
      callback();
    }, timeout);
  };

  const moveSlider = (forward) => {
    let nextSliderIndex = currentSlider;
    if (forward) {
      nextSliderIndex = (currentSlider + 1) < sliderItems.length ? (currentSlider + 1) : 0;
    }
    else {
      nextSliderIndex = (currentSlider - 1) >= 0 ? (currentSlider - 1) : (sliderItems.length - 1);
    }
    
    if (currentSlider !== nextSliderIndex) {
      set(() => {
        set_currentSlider(nextSliderIndex);
        set_sliderTime(sliderTimes[nextSliderIndex]);
      });
    }
  };

  const getLocation = async () => {
    const newLocation = await getLocationInfo();
    if (newLocation) {
      set(() => {
        set_location(newLocation);
      });
    }
  }

  const getDate = () => {
    if (location?.timezone) {
      moment.locale(localeLang);
      const newMomentDate = moment.utc().tz(location?.timezone);
      let newDate = newMomentDate.format('DD / MMM / YYYY');
      newDate = newDate.replace(/\./g, '');
      newDate = capitalize(newDate);
      
      const newWeekDay = capitalize(newMomentDate.format('dddd'));
      set(() => {
        set_date(newMomentDate);
        set_formattedDate(newDate);
        set_weekDay(newWeekDay);
      });
    }
  };

  const getTime = () => {
    if (location?.timezone) {
      const now = moment.utc().tz(location?.timezone);
      const newTime = now.format('hh:mm A');
      set(() => {
        set_time(newTime);
      });
    }
  };

  const setBackgroundColor = () => {
    const now = moment.utc().tz(location?.timezone);
    let newIsDay = isDay;
    let newIsNight = isNight;

    if (weather?.sunRise && weather?.sunSet) {
      if (now >= moment(weather?.sunRise) && now <= moment(weather?.sunSet)) {
        newIsDay = true;
        newIsNight = false;        
      }
      else {
        newIsDay = false;
        newIsNight = true;
      }
    }
    set(() => {
      set_isDay(newIsDay);
      set_isNight(newIsNight);
      
      const newBackgroundColor = newIsDay === true ? 'day' : (newIsNight === true ? 'night' : 'none');
      set_backgroundColor(newBackgroundColor);
    });
  };

  const setupSliderItems = () => {
    const newSliderItems = [];
    const newSliderTimes = [];
    const headerFormattedDate = date ? capitalize(date.format('dddd')).substr(0, 3) + ' / ' + formattedDate : '';
    
    const onlyWeatherHeader = (weather ? (
      <MainHeader temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} /> 
      ) : <></>
    );

    const dateTimeHeader = (
      <MainHeader date={headerFormattedDate}
                  time={time} 
                  onTouchEnd={fullscreenHandler} />
    );

    const timeWeatherHeader = (time && weather ? (
        <MainHeader temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted}
                  time={time} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} />
      ) : <></>
    );

    const fullHeader = (weather ? (
      <MainHeader temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted}
                  date={headerFormattedDate}
                  time={time} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} />
      ) : <></>
    );

    if (date && time) {
      newSliderItems.push(
        <>
          {onlyWeatherHeader}
          <DateTime date={formattedDate}
                    time={time}
                    weekDay={weekDay} /> 
        </>
      );
      newSliderTimes.push(30 * second);
    }

    if (date) {
      newSliderItems.push(
        <>
          {timeWeatherHeader}
          <Calendar date={date} />
        </>
      )
      newSliderTimes.push(30 * second);
    }

    if (weather && currentForecast) {
      newSliderItems.push(
        <>
          {dateTimeHeader}
          <WeatherCurrent weather={weather} 
                          currentForecast={currentForecast} />
        </>
      );
      newSliderTimes.push(20 * second);
    }
    
    if (weather) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherCurrentComp weather={weather} 
                              sunRise={moment(weather?.sunRise).format('hh:mm A')}
                              sunSet={moment(weather?.sunSet).format('hh:mm A')} 
                              dayLight={weather?.formattedDayLight}/>
        </>
      );
      newSliderTimes.push(20 * second);
    }

    if (forecastHourly && forecastHourly.length > 0) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherForecastHourly forecast={forecastHourly} />
        </>
      );
      newSliderTimes.push(30 * second);
    }
    
    if (forecastDaily && forecastDaily.length > 0) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherForecastDaily forecast={forecastDaily}/>
        </>
      );
      newSliderTimes.push(30 * second);
    }
    
    if (exchangeRates && exchangeRates.length > 0) {
      newSliderItems.push(
        <>
          {fullHeader}
          <ExchangeRate rates={exchangeRates} />
        </>
      );
      newSliderTimes.push(10 * second);
    }

    set(() => {
      set_sliderItems(newSliderItems);
      set_sliderTimes(newSliderTimes);
    });

    if (currentSlider >= newSliderItems.length) {
      set(() => {
        set_currentSlider(0);
      });
    }
  };

  /* ASYNC */

  const getWeatherConditions = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.conditions);
    const now = moment(Date.now());
    force = force || (now - moment(lastUpdate)) >= intervals.conditions;

    if (location?.coordinates) {
      let currentWeather = await getCurrentWeather(location?.coordinates?.latitude, location?.coordinates?.longitude, t, force);

      if (currentWeather) {
        set(() => {
          set_weather(currentWeather);
        });
      }
    }
  };

  const getWeatherForecastHourly = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastHourly);
    const now = moment(Date.now());
    force = force || (now - moment(lastUpdate)) >= intervals.forecastHourly;
    
    if (forecastHourly && forecastHourly.length > 0) {
      force = force || Date.now() > forecastHourly[0].dateTime;
    }
    
    if (location?.coordinates) {
      const forecast = await getForecastHourly(location?.coordinates?.latitude, location?.coordinates?.longitude, t, force);
      if (forecast) {
        set(() => {
          set_forecastHourly(forecast);
        });
      }
    }
  };

  const getWeatherForecastDaily = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastDaily);
    const now = moment(Date.now());
    force = force || (now - moment(lastUpdate)) >= intervals.forecastDaily;
    
    if (forecastDaily && forecastDaily.length > 0) {
      force = force || !(moment(Date.now()).format('YYYY-MM-DD') === moment(forecastHourly[0].dateTime).format('YYYY-MM-DD'));
    }

    if (location?.coordinates) {
      let forecast = await getForecastDaily(location?.coordinates?.latitude, location?.coordinates?.longitude, localeLang, force);
      if (forecast) {
        const todayForecast = forecast.find(f => f.isToday === true);
        forecast = forecast.filter(f => f.isToday === false);
        
        set(() => {
          set_forecastDaily(forecast);
        });
        
        if (todayForecast) {
          set(() => {
            set_currentForecast({
              tempMax: todayForecast?.temp.max,
              tempMin: todayForecast?.temp.min,
              precipitationProbability: todayForecast?.precipitationProbability
            });
          });
        }
      }
    }
  };

  const getExchangeRates = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.exchangeRate);
    const now = moment(Date.now());
    force = force || (now - moment(lastUpdate)) >= intervals.exchangeRate;

    let rates = await getExchangeRate(force);
    set(() => {
      set_exchangeRates(rates);
    });
  }

  /* HANDLERS */

  const keyHandker = (e) => {
    if (e.charCode === 37 || e.keyCode === 37) {
      moveSlider(false);
    }
    if (e.charCode === 39 || e.keyCode === 39){
      moveSlider(true);
    }
  };

  const touchstartHandler = (e) => {
    var touchobj = e.changedTouches[0];
    setStorageValue('startTouch', touchobj.clientX);
    e.preventDefault();
  };

  const touchendHandlers = (e) => {
    var touchobj = e.changedTouches[0];
    setStorageValue('endTouchX', touchobj.clientX);
    const diff = parseInt(getStorageValue('startTouch')) - parseInt(getStorageValue('endTouchX'));
    
    set(() => {
      set_touchDiff(diff);
    });

    setStorageValue('startTouch', null);
    setStorageValue('endTouchX', null);
    e.preventDefault();
  };

  const fullscreenHandler = (e) => {
    var el = document.documentElement;
    if (document.fullscreen && document.fullscreenEnabled){
      document.exitFullscreen();
    }
    else {
      var rfs = el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
      rfs.call(el);
    }
  };
  
  useInterval(() => {
    moveSlider(true);
  }, sliderTime);

  const mainAction = async () => {
    getDate();
    getTime();
    await getWeatherConditions();
    await getWeatherForecastHourly();
    await getWeatherForecastDaily();
    await getExchangeRates();
  };

  useInterval(async ()=>{
    await mainAction();
  }, minute);

  useEffect(() => {
    (async () => {
      await getLocation();
      await mainAction();
      setupSliderItems();
    })();

    document.body.addEventListener('touchstart', touchstartHandler, false);
    document.body.addEventListener('touchend', touchendHandlers, false);
  }, []);

  useEffect(() => {
    setupSliderItems();
  }, [location, time, date, weather, forecastHourly, forecastDaily, exchangeRates])

  useEffect(() => {
    getDate();
    getTime();
    getWeatherConditions();
  }, [location]);

  useEffect(() => {
    setBackgroundColor();
  }, [location, weather]);

  useEffect(() => {
    if (touchDiff >= window.innerWidth / 2) {
      moveSlider(true);
    }
    else if (touchDiff <= ((window.innerWidth / 2) * -1)) {
      moveSlider(false);
    }
  }, [touchDiff]);

  return (
    <div className={'container-fliud m-0 p-0 ' + backgroundColor} onKeyDown={keyHandker}>
      <div className="mainSlider row m-0 p-0">
        <div className="col-12 m-0 p-0 content">
            { sliderItems.map((value, index) => {
              return currentSlider === index ? value : <></>;
            }) }
        </div>
      </div>
    </div>
  )
}
