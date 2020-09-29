import React from 'react';
import './WeatherForecastHourly.scss';

export default function WeatherForecastHourly(props) {
    const forecast = [...props.forecast];
    const borderClasses = ['border-right', 'border-right', 'border-right', 'border-none'];

    return (
        <div className="weatherForecastHourly">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastHourly_item ' + borderClasses[i]}>
                    <span className="main_text">
                      <div>{f.dateTime}</div>
                      <div>{f.text}</div>
                    </span>
                    <img className="icon" src={f.icon} alt={f.text} />
                    <span className="text_info">
                      <div>{f.temp.value} °{f.temp.unit}</div>
                      <div>({f.feel.value} °{f.feel.unit})</div>
                      {
                        (f.uv.index > 0) ? <div>UV: {f.uv.index}</div> : null
                      }
                      {
                        (f.precipitationProbability && f.precipitationProbability > 0)
                        ? <div>Rain: {f.precipitationProbability} %</div> : null
                      }
                    </span>
                </span>
            ))}
        </div>
    );
}
