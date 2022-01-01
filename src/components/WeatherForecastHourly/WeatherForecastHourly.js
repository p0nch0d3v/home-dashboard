import React from 'react';

export default function WeatherForecastHourly({ forecast }) {
    const borderClasses = ['borderRight', 'borderRight', 'borderRight', 'borderRight', 'borderNone'];

    return (
        <div className="weatherForecastHourly">
            {forecast.map((f, i) => (
                <span key={i} className={'weatherForecastHourly_item ' + borderClasses[i]}>
                    <span className="main_text">
                      <div>{f.formattedDateTime}</div>
                    </span>
                    <span className={'icon ' + f.iconCode}></span>
                    <span className="text_info">
                      <div>{f.temp.value} °{f.temp.unit}</div>
                      {
                        f.temp.value !== f.feel.value ? <div>({f.feel.value} °{f.feel.unit})</div> : <div>&nbsp;</div>
                      }
                      {
                        (f.uv.index > 0) ? <div>UV: {f.uv.index}</div> : <div>&nbsp;</div>
                      }
                      {
                        (f.precipitationProbability && f.precipitationProbability > 0) ? <div>[{f.precipitationProbability} %]</div> : <div>&nbsp;</div>
                      }
                    </span>
                </span>
            ))}
        </div>
    );
}
