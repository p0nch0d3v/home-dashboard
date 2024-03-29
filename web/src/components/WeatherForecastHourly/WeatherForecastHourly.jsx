import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSun,
  faTint
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import './WeatherForecastHourly.scss';

export default function WeatherForecastHourly({ forecast }) {
    const borderClasses = ['borderRight', 'borderRight', 'borderRight', 'borderRight', 'borderNone'];

    return (
        <div className="weatherForecastHourly">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastHourly_item ' + borderClasses[i]}>
                    <span className="main_text">{f.formattedDateTime}</span>
                    <span className={'icon ' + f.iconCode}></span>
                    <span className="description">{f.text}</span>
                    <span className="text_info">
                      <div>{f.temp.value} °{f.temp.unit}</div>
                      {
                        f.temp.value !== f.feel.value ? 
                          <div>({f.feel.value} °{f.feel.unit})</div> 
                          : <div>&nbsp;</div>
                      }
                      
                      {
                        (f.uv.index > 0) ? 
                          <div style={{ backgroundColor: f.uv.color }}><FontAwesomeIcon icon={faSun} />  {f.uv.index}</div> 
                          : <div>&nbsp;</div>
                      }
                      {
                        (f.precipitationProbability && f.precipitationProbability > 1) ? 
                          <div><FontAwesomeIcon icon={faTint} />  {f.precipitationProbability} %</div> 
                          : <div>&nbsp;</div>
                      }
                    </span>
                </span>
            ))}
        </div>
    );
}
