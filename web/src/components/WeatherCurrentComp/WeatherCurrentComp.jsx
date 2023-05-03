import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import './WeatherCurrentComp.scss';
import DayLigth from '../DayLigth/DayLigth';
import UVIndex from './UVIndex';
import Humidity from './Humidity';
import Pressure from './Pressure';
import Wind from './Wind';
import SunInfo from './SunInfo';
import MoonInfo from './MoonInfo';
import AirQuality from './AirQuality';

function WeatherCurrentComp(
    { uv,
        humidity,
        pressure,
        wind,
        sunrise,
        sunset,
        dayLight,
        moon,
        dayLigthData,
        airQuality
    }) {
    const { t } = useTranslation();

    const uv_item = (uv && uv?.index > 0 && <UVIndex uv={uv} />);

    const humidity_item = (humidity && humidity > 0 && <Humidity humidity={humidity} />)

    const pressure_item = (pressure && pressure.value > 0 && <Pressure pressure={pressure} />);

    const wind_item = (wind && wind?.speed?.value > 0 && <Wind wind={wind} />);

    const sunInfo_item = ((sunrise || sunset || dayLight) && <SunInfo sunrise={sunrise} sunset={sunset} dayLight={dayLight} />);

    const dayLigth_item = ((sunrise || sunset || dayLight) &&
        <div className="weatherCurrentComp_item sunInfo borderAll">
            <DayLigth sunrise={sunrise} sunset={sunset} dayLigthData={dayLigthData} dayLight={dayLight} />
        </div>);

    const moonInfo_item = (moon && <MoonInfo moon={moon} />);

    const airQuality_item = (airQuality && <AirQuality aqi={airQuality.aqi} text={airQuality.aqiText} aqiColor={airQuality.aqiColor} />)

    let items_array = [uv_item, humidity_item, airQuality_item, wind_item, sunInfo_item, moonInfo_item];

    return (
        <div className="weatherCurrentComp">
            {items_array.map((v, i) => {
                { return v }
            })}
        </div>
    );
}

export default withTranslation()(WeatherCurrentComp); 
