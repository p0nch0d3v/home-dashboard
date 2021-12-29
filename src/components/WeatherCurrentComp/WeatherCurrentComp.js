import React from 'react';

export default function WeatherCurrentComp(props){
    return (
        <div className="weatherCurrentComp">
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div>UV: {props.weather.uv.index}</div>
                {
                    props.weather.uv.index > 0 ? 
                    <div>{props.weather.uv.text}</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderRight borderBottom">
                <div>Humidity:</div>
                {
                    props.weather.humidity > 0 ?
                    <div>{props.weather.humidity} %</div> : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderBottom">
                <div>Pressure:</div>
                <div>{props.weather.pressure.value} {props.weather.pressure.unit}</div>
            </div>
            <div className="weatherCurrentComp_item borderRight">
                <div>Wind:</div>
                {
                    props.weather.wind.speed.value > 0 ?
                    (<>
                        <div>{props.weather.wind.speed.value} {props.weather.wind.speed.unit}</div>
                        <div>{props.weather.wind.direction}</div>
                    </>) : <></>
                }
            </div>
            <div className="weatherCurrentComp_item borderRight">
                <div>Sunrise:</div>
                <div>{props.sunRise}</div>
            </div>
            <div className="weatherCurrentComp_item">
                <div>Sunset:</div>
                <div>{props.sunSet}</div>
            </div>
        </div>
    );
}
