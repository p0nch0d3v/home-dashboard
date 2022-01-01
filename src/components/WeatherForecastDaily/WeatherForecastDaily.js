import React from 'react';

export default function WeatherForecastDaily({ forecast }) {
    const borderClasses = ['borderRight', 'borderRight', 'borderRight', 'borderRight','borderNone'];

    return (
        <div className="weatherForecastDaily">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastDaily_item ' + borderClasses[i]}>
                  <span className="main_text">
                    <div>{f.date.month} / {f.date.dayNumber}</div>
                    <div>{f.date.dayWeek}</div>
                  </span>
                  <span className={'icon ' + f.iconCode}></span>
                  <span className="text_info">
                    <div>{f.temp.min.value} °{f.temp.min.unit}</div>
                    <div>{f.temp.max.value} °{f.temp.max.unit}</div>
                    {
                      (f.precipitationProbability && f.precipitationProbability > 0)
                      ? <div>[{f.precipitationProbability} %]</div> : <div>&nbsp;</div>
                    }
                  </span>
                </span>
            ))}
        </div>
    )
}
