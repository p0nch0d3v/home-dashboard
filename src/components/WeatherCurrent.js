import React from 'react';
import './WeatherCurrent.scss'

export default function WeatherCurrent(props){
    return(
        <div className="weatherCurrent row m-0">
            <div className="weatherCurrent_item">
                <img className="icon" src={props.weather.icon} alt={props.weather.text} />
            </div>
            <div className="weatherCurrent_item">
                <span>{props.weather.temp.value} °{props.weather.temp.unit}</span>
                <span>({props.weather.feel.value} °{props.weather.feel.unit})</span>
            </div>
            <div className="weatherCurrent_doubleItem">
                <span>{props.weather.text}</span>
            </div>
        </div>
    );
}
