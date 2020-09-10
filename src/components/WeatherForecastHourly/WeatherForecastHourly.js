import React from 'react';
import './WeatherForecastHourly.scss';

export default function WeatherForecastHourly(props) {
    const forecast = [...props.forecast];
    const borderClasses = ['border-right', 'border-bottom', 'border-top', 'border-left'];

    return (
        <div className="weatherForecastHourly">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastHourly_item ' + borderClasses[i]}>
                    <span className="weatherForecastHourly_doubleSubItem main_text">
                      <div>{f.dateTime}</div>
                      <div>{f.text}</div>
                    </span>
                    <span className="weatherForecastHourly_subItem">
                      <img className="icon" src={f.icon} alt={f.text} />
                    </span>
                    <span className="weatherForecastHourly_subItem text_info">
                      <div>{f.temp.value} °{f.temp.unit}</div>
                      <div>({f.feel.value} °{f.feel.unit})</div>
                      <div>UV: {f.uv.index} {f.uv.text}</div>
                      <div>Rain: {f.precipitationProbability} %</div>
                    </span>
                </span>
            ))}
        </div>
    );
}
