import { useEffect, useState } from 'react';
import dayjs from 'dayjs/esm/index.js'
import 'dayjs/esm/locale/es'
import dayOfYear from 'dayjs/plugin/dayOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next'
import { capitalize, consoleDebug, useInterval } from '../../helpers';
import { Times } from '../../constants';
import './MainSlider.scss';

import {
  getCurrentWeather,
  getForecastHourly,
  getForecastDaily
} from '../../services/OpenWeatherMap';

import { getLocationInfo } from '../../services/LocationService'

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from '../../services/DataService';

import { getExchangeRate } from '../../services/ExchangeRate';
import { GetDate, GetTime } from '../../services/DateTimeService';
import { GetConfigurations, SaveConfigurations } from '../../services/ConfigService';
import { GetLastTweetBy } from '../../services/HomeDashboardService';

import DateTime from '../DateTime/DateTime';
import WeatherCurrent from '../WeatherCurrent/WeatherCurrent';
import WeatherCurrentComp from '../WeatherCurrentComp/WeatherCurrentComp';
import WeatherForecastHourly from '../WeatherForecastHourly/WeatherForecastHourly';
import WeatherForecastDaily from  '../WeatherForecastDaily/WeatherForecastDaily';
import ExchangeRate from '../ExchangeRate/ExchangeRate';
import Calendar from '../Calendar/Calendar';
import MainHeader from '../MainHeader/MainHeader';
import ModalConfig from '../ConfigModal/ConfigModal';
import LastTweetBy from '../LastTweetBy/LastTweetBy';

dayjs.extend(dayOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

export default function MainSlider(props) {
  const [configurations, set_configurations] = useState(GetConfigurations());

  const [localeLang] = useState(configurations.language || 'en');
  const [backgroundColor, set_backgroundColor] = useState('none');
  
  const [currentSlider, set_currentSlider] = useState(0);
  const [sliderItems, set_sliderItems] = useState([]);
  const [sliderTimes, set_sliderTimes] = useState([]);
  const [sliderTime, set_sliderTime] = useState(5 * Times.second);
  const [touchDiff, set_touchDiff] = useState(null);

  const [date, set_date]= useState(null);
  const [formattedDate, set_formattedDate]= useState(null);
  const [time, set_time]= useState(null);
  const [weekDay, set_weekDay]= useState(null);
  const [dayOfYear, set_dayOfYear] = useState(null);
  const [remainingDaysOfYear, set_remainingDaysOfYear] = useState(null);
  const [isDay, set_isDay]= useState(null);
  const [isNight, set_isNight]= useState(null);

  const [showModalConfig, set_showModalConfig] = useState(false);

  const [location, set_location] = useState(null);
  const [weather, set_weather] = useState(null);
  const [currentForecast, set_currentForecast] = useState(null);
  const [currentMoon, set_currentMoon] = useState(null);
  const [forecastHourly, set_forecastHourly] = useState([]);
  const [forecastDaily, set_forecastDaily] = useState([]);
  const [exchangeRates, set_exchangeRates] = useState([]);
  const [lastTweetBy, set_lastTweetBy] = useState(null);

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

  const getDate = () => {
    const newDate = GetDate(location?.timezone);
    if (newDate) {
      set(() => {
        set_date(newDate.date);
        set_formattedDate(newDate.formattedDate);
        set_weekDay(newDate.weekDay);
        set_dayOfYear(newDate.dayOfYear);
        set_remainingDaysOfYear(newDate.remainingDaysOfYear);
      });  
    }
  };

  const getTime = () => {
    const newTime = GetTime(location?.timezone);
    if (newTime) {
      set(() => {
        set_time(newTime);
      });
    }
  };

  const setBackgroundColor = () => {
    const now = dayjs.utc().tz(location?.timezone);
    let newIsDay = isDay;
    let newIsNight = isNight;

    if (weather?.sunrise && weather?.sunset) {
      if (now >= dayjs(weather?.sunrise) && now <= dayjs(weather?.sunset)) {
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
    dayjs().locale(configurations.language);
    const newSliderItems = [];
    const newSliderTimes = [];
    const headerFormattedDate = date ? capitalize(date.format('dddd')).substr(0, 2) + ' ' + formattedDate : '';

    const onlyWeatherHeader = (weather ? (
      <MainHeader className="only-weather" 
                  temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} /> 
      ) : <></>
    );

    const dateTimeHeader = (
      <MainHeader className="date-time"
                  date={headerFormattedDate}
                  time={time} 
                  onTouchEnd={fullscreenHandler} />
    );

    const timeWeatherHeader = (weather ? (
        <MainHeader className="time-weather"
                    temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted}
                  time={time} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} />
      ) : <></>
    );

    const fullHeader = (weather ? (
      <MainHeader className="full" 
                  temp={weather?.temp?.formatted}
                  feelTemp={weather?.feel?.formatted}
                  date={headerFormattedDate}
                  time={time} 
                  iconCode={weather?.iconCode} 
                  onTouchEnd={fullscreenHandler} />
      ) : <></>
    );

    if (date && time && 
        configurations?.widgets?.DateTime?.isActive) {
      newSliderItems.push(
        <>
          {onlyWeatherHeader}
          <DateTime date={formattedDate}
                    time={time}
                    weekDay={weekDay} /> 
        </>
      );
      newSliderTimes.push(configurations?.widgets?.DateTime?.time?.total);
    }

    if (date && 
        configurations?.widgets?.Calendar?.isActive) {
      newSliderItems.push(
        <>
          {timeWeatherHeader}
          <Calendar date={date}
                    dayOfYear={dayOfYear}
                    remainingDaysOfYear={remainingDaysOfYear} />
        </>
      )
      newSliderTimes.push(configurations?.widgets?.Calendar?.time?.total);
    }

    if (weather && 
          configurations?.widgets?.WeatherCurrent?.isActive &&
          configurations?.services?.WeatherCurrent?.isActive) {
      newSliderItems.push(
        <>
          {dateTimeHeader}
          <WeatherCurrent weather={weather}
                          currentForecast={currentForecast} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.WeatherCurrent?.time?.total);
    }
    
    if (weather && 
          configurations?.widgets?.WeatherCurrentComp?.isActive &&
          configurations?.services?.WeatherCurrent?.isActive) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherCurrentComp uv={weather?.uv} 
                              humidity={weather?.humidity}
                              pressure={weather?.pressure}
                              wind={weather?.wind}
                              sunrise={weather.formattedSunrise}
                              sunset={weather.formattedSunset} 
                              dayLigthData={weather.dayLigthData}
                              dayLight={weather?.formattedDayLight}
                              moon={currentMoon} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.WeatherCurrentComp?.time?.total);
    }

    if (forecastHourly && forecastHourly.length > 0 && 
        configurations?.widgets?.WeatherForecastHourly?.isActive &&
        configurations?.services?.WeatherForecastHourly?.isActive) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherForecastHourly forecast={forecastHourly} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.WeatherForecastHourly?.time?.total);
    }
    
    if (forecastDaily && forecastDaily.length > 0 && 
        configurations?.widgets?.WeatherForecastDaily?.isActive &&
        configurations?.services?.WeatherForecastDaily?.isActive) {
      newSliderItems.push(
        <>
          {fullHeader}
          <WeatherForecastDaily forecast={forecastDaily}/>
        </>
      );
      newSliderTimes.push(configurations?.widgets?.WeatherForecastDaily?.time?.total);
    }
    
    if (exchangeRates && exchangeRates.length > 0 && 
          configurations?.widgets?.ExchangeRate?.isActive &&
          configurations?.services?.ExchangeRate?.isActive) {
      newSliderItems.push(
        <>
          {fullHeader}
          <ExchangeRate rates={exchangeRates} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.ExchangeRate?.time?.total);
    }
    
    if (configurations?.widgets?.Twitter?.isActive && lastTweetBy && lastTweetBy.lastTweets.length > 0) {
      newSliderItems.push(
        <>
          {fullHeader}
          <LastTweetBy tweetUser={lastTweetBy.user} tweetData={lastTweetBy.lastTweets[0]} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.Twitter?.time?.total);
    }

    if (configurations?.widgets?.Twitter?.isActive && lastTweetBy && lastTweetBy.lastTweets.length > 1) {
      newSliderItems.push(
        <>
          {fullHeader}
          <LastTweetBy tweetUser={lastTweetBy.user} tweetData={lastTweetBy.lastTweets[1]} />
        </>
      );
      newSliderTimes.push(configurations?.widgets?.Twitter?.time?.total);
    }

    console.debug(newSliderTimes);

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

  const removeIframe = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.remove();
    }
  };

  /* ASYNC */

  const getLocation = async () => {
    const newLocation = await getLocationInfo();
    if (newLocation) {
      set(() => {
        set_location(newLocation);
      });
    }
  }

  const getWeatherConditions = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.conditions);
    const now = dayjs(Date.now());
    
    force = force || ((now - dayjs(lastUpdate)) >= configurations?.services?.WeatherCurrent?.time?.total) || !lastUpdate;

    let currentWeather = await getCurrentWeather(location?.coordinates?.latitude, location?.coordinates?.longitude, t, force);

    if (currentWeather) {
      set(() => {
        set_weather(currentWeather);
      });
    }
  };

  const getWeatherForecastHourly = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastHourly);
    const now = dayjs(Date.now());
    
    force = force || ((now - dayjs(lastUpdate)) >= configurations?.services?.WeatherForecastHourly?.time?.total) || !lastUpdate;
    
    if (forecastHourly && forecastHourly.length > 0) {
      force = force || dayjs(now).hour() > dayjs(forecastHourly[0].dateTime).hour() 
          || dayjs(now).date() > dayjs(forecastHourly[0].dateTime).date()
          || dayjs(now).month() > dayjs(forecastHourly[0].dateTime).month()
          || dayjs(now).year() > dayjs(forecastHourly[0].dateTime).year();
    }
    
    const forecast = await getForecastHourly(location?.coordinates?.latitude, location?.coordinates?.longitude, t, force);
    if (forecast) {
      set(() => {
        set_forecastHourly(forecast);
      });
    }
  };

  const getWeatherForecastDaily = async (force = false) => {
    dayjs().locale(configurations?.language);
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.forecastDaily);
    const now = dayjs(Date.now());
    
    force = force || ((now - dayjs(lastUpdate)) >= configurations?.services?.WeatherForecastDaily?.time?.total) || !lastUpdate;
    
    if (forecastDaily && forecastDaily.length > 0) {
      force = force || !(dayjs(Date.now()).format('YYYY-MM-DD') === dayjs(forecastDaily[0].dateTime).format('YYYY-MM-DD'));
    }
    
    let forecast = await getForecastDaily(location?.coordinates?.latitude, location?.coordinates?.longitude, localeLang, t, force);
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
        
        set(() => {
          set_currentMoon({ ...todayForecast?.moon });
        });
      }
    }
  };

  const getExchangeRates = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.exchangeRate);
    const now = dayjs(Date.now());
    
    force = force || ((now - dayjs(lastUpdate)) >= configurations?.services?.ExchangeRate?.time?.total) || !lastUpdate;

    let rates = await getExchangeRate(force);
    set(() => {
      set_exchangeRates(rates);
    });
  }

  const getLastTweetBy = async (force = false) => {
    const lastUpdate = getStorageValue(StorageKeys.lastUpdate.lastTweetBy);
    const now = dayjs(Date.now());

    force = force || ((now - dayjs(lastUpdate)) >= configurations?.services?.Twitter?.time?.total) || !lastUpdate;

    let lastTweetBy = await GetLastTweetBy(force);

    set(() => {
      set_lastTweetBy(lastTweetBy);
    })
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

  const touchStartHandler = (e) => {
    var touchobj = e.changedTouches[0];
    setStorageValue('startTouch', touchobj.clientX);
    
    if (getStorageValue("startTouchTime")) {
      const now = new Date().getTime();
      const elapsed = (now - getStorageValue("startTouchTime"));

      if (elapsed <= 250 && elapsed > 0) {
        set(() => {
          set_showModalConfig(true);
        });
      }
    }

    setStorageValue("startTouchTime", new Date().getTime());
    e.preventDefault();
  };

  const touchEndHandlers = (e) => {
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

  const onCloseModalConfig = (e) => {
    e.preventDefault();
    set(() => {
      set_showModalConfig(false);
    });
  };

  const contentDoubleClick = (e) => {
    set(() => {
      set_showModalConfig(!showModalConfig);
    });
  };
  
  const saveConfigurations = (c) => {
    set(() => {
      SaveConfigurations(c);
      set_configurations(GetConfigurations());
      set_showModalConfig(false);
      window.location.reload();
    });
  };

  useInterval(() => {
    moveSlider(true);
  }, sliderTime);

  const mainAction = async () => {
    if (!location && configurations?.services?.GeoLocation?.isActive) {
      await getLocation();
    }

    if (configurations?.widgets?.DateTime?.isActive || configurations?.widgets?.Calendar?.isActive) {
      getDate();
      getTime();
    }
    if (configurations?.services?.WeatherCurrent?.isActive) {
      await getWeatherConditions();
    }
    if (configurations?.services?.WeatherForecastHourly?.isActive) {
      await getWeatherForecastHourly();
    }
    if (configurations?.services?.WeatherForecastDaily?.isActive) {
      await getWeatherForecastDaily();
    }
    if (configurations?.services?.ExchangeRate?.isActive) {
      await getExchangeRates();
    }
    if (configurations?.services?.Twitter?.isActive) {
      await getLastTweetBy();
    }
  };

  useInterval(async () =>{
    await mainAction();
    removeIframe();
  }, Times.minute);

  useEffect(() => { // On load 
    (async () => {
      if (configurations?.services?.GeoLocation?.isActive) {
        await getLocation();
      }
      await mainAction();
      setupSliderItems();
    })();
    removeIframe();
  }, []);

  useEffect(() => { 
    setupSliderItems();
  }, [location, time, date, weather, forecastHourly, forecastDaily, exchangeRates, lastTweetBy, configurations])

  useEffect(() => {
    getDate();
    getTime();
    if (configurations?.services?.WeatherCurrent?.isActive) {
      getWeatherConditions();
    }
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
    <>
      <div className={'container-fliud m-0 p-0 ' + backgroundColor} onKeyDown={keyHandker}>
        <div className="mainSlider row m-0 p-0">
          <div className="col-12 m-0 p-0 content" 
              onTouchStart={touchStartHandler}
              onTouchEnd={touchEndHandlers}
              onDoubleClick={contentDoubleClick} > 
              { sliderItems.map((value, index) => {
                return currentSlider === index ? value : <></>;
              }) }
          </div>
        </div>  
      </div>
      <ModalConfig show={showModalConfig} 
                   onClose={onCloseModalConfig} 
                   onSave={saveConfigurations}
                   configurations={configurations} 
                   locationInfo={getStorageValue(StorageKeys.locationInfo) } />
    </>
  )
}
