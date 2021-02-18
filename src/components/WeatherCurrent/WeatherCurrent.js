import React from 'react';
import moment from 'moment';

export default function WeatherCurrent(props){
    return(
        <div className="weatherCurrent row m-0">
            <div className="weatherCurrent_item border-right">
                <span className={'icon ' + props.weather.iconCode}></span>
            </div>
            <div className="weatherCurrent_item">
                <span>{props.weather.temp.value} °{props.weather.temp.unit}</span>
                {props.weather.temp.value !== props.weather.feel.value ? <span>({props.weather.feel.value} °{props.weather.feel.unit})</span> : null}
            </div>
            <div className="weatherCurrent_doubleItem border-top">
                <span>{props.weather.text}</span>
                <span>{props.weather.tempMin.value} °{props.weather.tempMin.unit} - {props.weather.tempMax.value} °{props.weather.tempMax.unit}
                {
                  props.weather.precipitationProbability && props.weather.precipitationProbability >= 0
                  ?
                  <span> [{props.weather.precipitationProbability} %]</span>
                  : null
                }
                </span>
            </div>
        </div>
    );
}
