import React from 'react';
import './WeatherForecastDaily.scss';

export default function WeatherForecastDaily(props) {
    const forecast = [...props.forecast];
    const borderClasses = ['border-right', 'border-bottom', 'border-top', 'border-left'];
    return (
        <div className="weatherForecastDaily">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastDaily_item ' + borderClasses[i]}>
                  <span className="weatherForecastDaily_doubleSubItem main_text">
                    <div>{f.date.month} / {f.date.dayNumber}</div>
                    <div>{f.date.dayWeek}</div>
                  </span>
                  <span className="weatherForecastDaily_subItem">
                    <img className="icon" src={f.icon} alt={f.text} />
                  </span>
                  <span className="weatherForecastDaily_subItem text_info">
                    <div>Max: {f.temp.min.value} °{f.temp.min.unit}</div>
                    <div>Min: {f.temp.max.value} °{f.temp.max.unit}</div>
                    <div>Sunrise: {f.sunRise}</div>
                    <div>Sunset: {f.sunSet}</div>
                  </span>
                </span>
            ))}
        </div>
    )
}
