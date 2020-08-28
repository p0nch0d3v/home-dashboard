import React from 'react';

export default function WeatherForecastDaily(props) {
    const forecast = [...props.forecast];
    return (
        <ul>
            {forecast.map((f, i) => (
                <li key={i}>
                    <div>{f.date}</div>
                    <img src={f.icon} width="100" height="100" alt={f.text} />
                    <div>{f.text}</div>
                    <div>Max: {f.temp.min.value} {f.temp.min.unit}</div>
                    <div>Min: {f.temp.max.value} {f.temp.max.unit}</div>
                    <div>Sun Rise: {f.sunRise}</div>
                    <div>Sun Set: {f.sunSet}</div>
                </li>
            ))}
        </ul>
    )
}
