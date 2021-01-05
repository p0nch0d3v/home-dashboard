import React from 'react';
import './WeatherCurrentComp.scss';

export default function WeatherCurrentComp(props){
    return (
        <div className="weatherCurrentComp ">
            <div className="weatherCurrentComp_item border-right">
                <div>UV: {props.weather.uv.index}</div>
                <div> {props.weather.uv.text}</div>
            </div>
            <div className="weatherCurrentComp_item border-bottom">
                <div>Humidity:</div>
                <div>{props.weather.humidity} %</div>
            </div>
            <div className="weatherCurrentComp_item border-top">
                <div>Pressure:</div>
                <div>{props.weather.pressure.value} {props.weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item border-left">
                <div>Wind:</div>
                <div>{props.weather.wind.speed.value} {props.weather.wind.speed.unit}</div>
                <div>{props.weather.wind.direction}</div>
            </div>
        </div>
    );
}
