import React from 'react';
import moment from 'moment';
import './WeatherCurrent.scss'

export default function WeatherCurrent(props){
    return(
        <div className="weatherCurrent row m-0">
            <div className="weatherCurrent_item border-right">
                <img className="icon" src={props.weather.icon} alt={props.weather.text} />
            </div>
            <div className="weatherCurrent_item">
                <span>{props.weather.temp.value} °{props.weather.temp.unit}</span>
                {props.weather.temp.value !== props.weather.feel.value ? <span>({props.weather.feel.value} °{props.weather.feel.unit})</span> : null}
            </div>
            <div className="weatherCurrent_doubleItem border-top">
                <span>{props.weather.text}</span>
                {props.sunRise && props.sunSet && <span>{props.sunRise.format('HH:mm')} - {props.sunSet.format('HH:mm')}</span>}
            </div>
        </div>
    );
}
