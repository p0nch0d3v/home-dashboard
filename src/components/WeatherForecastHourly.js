import React from 'react';

export default function WeatherForecastHourly(props) {
    const forecast = [...props.forecast];
    return (
        <ul>
            {forecast.map((f, i) => (
                <li key={i}>
                    <div>{f.dateTime}</div>
                    <img src={f.icon} width="100" height="100" alt={f.text} />
                    <div>{f.text}</div>
                    <div>{f.temp.value} {f.temp.unit}</div>
                    <div>{f.feel.value} {f.feel.unit}</div>
                    <div>{f.uv.index} {f.uv.text}</div>
                    
                </li>
            ))}
        </ul>
    );
}
