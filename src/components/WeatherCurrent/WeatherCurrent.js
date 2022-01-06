import React from 'react';
import { capitalize } from '../../helpers';

export default function WeatherCurrent({ weather, currentForecast }) {
    const temp = (<span>{weather?.temp.value} °{weather?.temp.unit}</span>);
    
    const feelTemp = (weather?.temp.value !== weather?.feel.value ? <span>({weather?.feel.value} °{weather?.feel.unit})</span> : <></>)
    
    const threshold = <>{currentForecast?.tempMin.value} °{currentForecast?.tempMin.unit} - {currentForecast?.tempMax.value} °{currentForecast?.tempMax.unit}</>;
    
    const precipitation = currentForecast?.precipitationProbability && currentForecast?.precipitationProbability >= 0 ? <> [{currentForecast?.precipitationProbability} %]</> : <></>;
    
    return(
        <div className="weatherCurrent container-fluid m-0 p-0">
            <div className="row">
                <div className="weatherCurrent_item borderRight col-6 m-0 p-0">
                    <span className={'icon ' + weather?.iconCode}></span>
                </div>
                <div className="weatherCurrent_item col-6 m-0 p-0">
                    {weather?.temp.value > weather?.feel.value ? <>{temp}{feelTemp}</> : <>{feelTemp}{temp}</>}  
                </div>
            </div>
            <div className="weatherCurrent_doubleItem borderTop row m-0 p-0">
                <div className="col-12 m-0 p-0" style={{ wordBreak: 'keep-all', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {capitalize(weather?.text)}
                </div>
                <div className="col-12 m-0 p-0">
                    {threshold}
                    {precipitation}
                </div>
            </div>
        </div>
    );
}
