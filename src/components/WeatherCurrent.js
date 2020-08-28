import React from 'react';
import './WeatherCurrent.scss'

export default function WeatherCurrent(props){
    return(
        <div className="weatherCurrent row m-0">
          <div className="col-6 weatherCurrent_left">
            <img className="icon" src={props.weather.icon} alt={props.weather.text} />
          </div>
          <div className="col-6 weatherCurrent_right">
            <div className="text">{props.weather.text}</div>
            <div className="temp">{props.weather.temp.value} {props.weather.temp.unit}</div>
            <div className="feel">({props.weather.feel.value} {props.weather.feel.unit})</div>
          </div>
        </div>
    );
}
