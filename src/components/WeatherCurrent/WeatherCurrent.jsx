import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudRain, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { capitalize } from '../../helpers';
import './WeatherCurrent.scss';

export default function WeatherCurrent({ weather, currentForecast }) {
    const temp = (<span>{weather?.temp.value} °{weather?.temp.unit}</span>);
    
    const feelTemp = (weather?.temp.value !== weather?.feel.value ? <span>({weather?.feel.value} °{weather?.feel.unit})</span> : <></>)
        
    const precipitation = currentForecast?.precipitationProbability && currentForecast?.precipitationProbability > 1 ? (<><FontAwesomeIcon icon={faCloudRain} /> {currentForecast?.precipitationProbability} %</>) : <></>;
    
    return(
        <div className="weatherCurrent container-fluid m-0 p-0">
            <div className="row m-0 p-0">
                <div className="weatherCurrent_item weather-icon borderRight col-6 m-0 p-0">
                    <span className={'icon ' + weather?.iconCode}></span>
                </div>
                <div className="weatherCurrent_item weather-temp col-6 m-0 p-0">
                    <>{temp}{feelTemp}</>
                </div>
            </div>
            <div className="weatherCurrent_doubleItem borderTop row m-0 p-0">
                <div className="weather-text col-12 m-0 p-0">
                    {capitalize(weather?.text)}
                </div>
                {currentForecast && 
                    <div className="weather-forecast col-12 m-0 p-0">
                        {currentForecast?.tempMin && 
                            <span>
                                <FontAwesomeIcon icon={faAngleDown} /> {currentForecast?.tempMin.value} °{currentForecast?.tempMin.unit}
                            </span>
                        }
                        {currentForecast?.tempMax && 
                            <span>
                                <FontAwesomeIcon icon={faAngleUp} /> {currentForecast?.tempMax.value} °{currentForecast?.tempMax.unit}
                            </span>
                        }
                        {precipitation &&
                            <span>
                                {precipitation}
                            </span>
                        }
                    </div>
                }
            </div>
        </div>
    );
}
