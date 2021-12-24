import React from 'react';

export default function WeatherCurrent(props){
    const temp = (<span>{props.weather.temp.value} °{props.weather.temp.unit}</span>);
    
    const feelTemp = (props.weather.temp.value !== props.weather.feel.value ? <span>({props.weather.feel.value} °{props.weather.feel.unit})</span> : null)
    
    const threshold = <>{props.weather.tempMin.value} °{props.weather.tempMin.unit} - {props.weather.tempMax.value} °{props.weather.tempMax.unit}</>;
    
    const precipitation = props.weather.precipitationProbability && props.weather.precipitationProbability >= 0 ? <> [{props.weather.precipitationProbability} %]</> : null;
    
    return(
        <div className="weatherCurrent container-fluid m-0 p-0">
            <div className="row">
                <div className="weatherCurrent_item border-right col-6 m-0 p-0">
                    <span className={'icon ' + props.weather.iconCode}></span>
                </div>
                <div className="weatherCurrent_item col-6 m-0 p-0">
                    {props.weather.temp.value > props.weather.feel.value ? <>{temp}{feelTemp}</> : <>{feelTemp}{temp}</>}  
                </div>
            </div>
            <div className="weatherCurrent_doubleItem border-top row m-0 p-0">
                <div className="col-12 m-0 p-0" style={{  wordBreak: 'keep-all', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {props.weather.text}
                </div>
                <div className="col-12 m-0 p-0">
                    {threshold}
                    {precipitation}
                </div>
            </div>
        </div>
    );
}
