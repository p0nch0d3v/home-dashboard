import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTint, 
    faCompressArrowsAlt, 
    faSun, 
    faWind, 
    faUmbrella, 
    faMoon, 
    faAdjust 
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

function WeatherCurrentComp({ weather, sunRise, sunSet, dayLight }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp">
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div><FontAwesomeIcon icon={faUmbrella} /> UV {weather.uv.index}</div>
                {
                    weather.uv.index > 0 ? 
                    <div>{weather.uv.text}</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div><FontAwesomeIcon icon={faTint} /> {t("Humidity")}</div>
                {
                    weather.humidity > 0 ?
                    <div>{weather.humidity} %</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderBottom">
                <div><FontAwesomeIcon icon={faCompressArrowsAlt} /> {t("Pressure")}</div>
                <div>{weather.pressure.value} {weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item borderRight">
                <div><FontAwesomeIcon icon={faWind} /> {t("Wind")}:</div>
                {
                    weather.wind.speed.value > 0 ?
                    (<>
                        
                        <div>{weather.wind.speed.value} {weather.wind.speed.unit}</div>
                        <div>{weather.wind.direction}</div>
                    </>) : <></>
                }
            </div>
            <div className="weatherCurrentComp_double_width_item sunInfo">
                <span className="sunrise">
                    <span><FontAwesomeIcon icon={faSun} /> {t("Sunrise")}</span>
                    <span>{sunRise}</span>
                </span>
                <span className="sunset">
                    <span><FontAwesomeIcon icon={faMoon} /> {t("Sunset")}</span>
                    <span>{sunSet}</span>
                </span>
                <span className="dayLight">
                    <span><FontAwesomeIcon icon={faAdjust} /> {t("DayLigth")}</span>&nbsp;&nbsp;
                    <span>{dayLight}</span>
                </span>
            </div>
        </div>
    );
}

export default withTranslation()(WeatherCurrentComp); 
