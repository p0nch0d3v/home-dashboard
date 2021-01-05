import React from 'react';
import moment from 'moment';
import './WeatherForecastDaily.scss';

export default function WeatherForecastDaily(props) {
    const forecast = [...props.forecast];
    const borderClasses = ['border-right', 'border-right', 'border-right', 'border-none'];

    return (
        <div className="weatherForecastDaily">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastDaily_item ' + borderClasses[i]}>
                  <span className="main_text">
                    <div>{f.date.month} / {f.date.dayNumber}</div>
                    <div>{f.date.dayWeek}</div>
                  </span>
                  <img className="icon" src={f.icon} alt={f.text} />
                  <span className="text_info">
                    <div>{f.temp.min.value} °{f.temp.min.unit}</div>
                    <div>{f.temp.max.value} °{f.temp.max.unit}</div>
                    {
                      (f.precipitationProbability && f.precipitationProbability > 0)
                      ? <div>[{f.precipitationProbability} %]</div> : null
                    }
                  </span>
                </span>
            ))}
        </div>
    )
}
