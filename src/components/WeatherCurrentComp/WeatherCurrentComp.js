import React from 'react';

export default function WeatherCurrentComp({ weather, sunRise, sunSet, dayLight }){
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
                <div>Humidity:</div>
                {
                    weather.humidity > 0 ?
                    <div>{weather.humidity} %</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderBottom">
                <div>Pressure:</div>
                <div>{weather.pressure.value} {weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item borderRight">
                <div>Wind:</div>
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
                    <span>Sunrise:</span>
                    <span>{sunRise}</span>
                </span>
                <span className="sunset">
                    <span>Sunset:</span>
                    <span>{sunSet}</span>
                </span>
                <span className="dayLight">
                    <span>Day Ligth:</span>&nbsp;&nbsp;
                    <span>{dayLight}</span>
                </span>
            </div>
        </div>
    );
}
