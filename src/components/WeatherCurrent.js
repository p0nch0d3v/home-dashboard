import React from 'react';

export default function WeatherCurrent(props){
    return(
        <div>
            <div>{props.weather.text}</div>
            <img src={props.weather.icon} width="100" height="100" alt={props.weather.text} />
            <div>Temp: {props.weather.temp.value} {props.weather.temp.unit}</div>
            <div>Feel: {props.weather.feel.value} {props.weather.feel.unit}</div>
        </div>
    );
}
