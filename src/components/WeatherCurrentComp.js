import React from 'react';


function WeatherCurrentComp(props){
    return (
        <div>
            <div>UV Index: {props.weather.uv.index} {props.weather.uv.text}</div>
            <div>Humidity: {props.weather.humidity}</div>
            <div>Pressure: {props.weather.pressure.value} {props.weather.pressure.unit}</div>
        </div>
    );
}

export default WeatherCurrentComp;