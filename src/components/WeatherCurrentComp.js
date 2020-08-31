import React from 'react';
import './WeatherCurrentComp.scss';

export default function WeatherCurrentComp(props){
    return (
        <div className="weatherCurrentComp">
            <div className="weatherCurrentComp_item">
                <div>UV: {props.weather.uv.index}</div>
                <div> {props.weather.uv.text}</div>
            </div>
            <div className="weatherCurrentComp_item">
                <div>Humidity:</div>
                <div>{props.weather.humidity} %</div>
            </div>
            <div className="weatherCurrentComp_item">
                <div>Pressure:</div>
                <div>{props.weather.pressure.value} {props.weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item">
                <div>Wind:</div>
                <div>{props.weather.wind.speed.value} {props.weather.wind.speed.unit} {props.weather.wind.direction}</div>
            </div>
        </div>
    );
}
