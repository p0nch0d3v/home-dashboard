import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

function WeatherCurrentComp({ weather, sunRise, sunSet, dayLight }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp">
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div>UV: {weather.uv.index}</div>
                {
                    weather.uv.index > 0 ? 
                    <div>{weather.uv.text}</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div>{t("Humidity")}:</div>
                {
                    weather.humidity > 0 ?
                    <div>{weather.humidity} %</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderBottom">
                <div>{t("Pressure")}:</div>
                <div>{weather.pressure.value} {weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item borderRight">
                <div>{t("Wind")}:</div>
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
                    <span>{t("Sunrise")}:</span>
                    <span>{sunRise}</span>
                </span>
                <span className="sunset">
                    <span>{t("Sunset")}:</span>
                    <span>{sunSet}</span>
                </span>
                <span className="dayLight">
                    <span>{t("DayLigth")}:</span>&nbsp;&nbsp;
                    <span>{dayLight}</span>
                </span>
            </div>
        </div>
    );
}

export default withTranslation()(WeatherCurrentComp); 
