import React from 'react';
import { capitalize } from '../helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons';

export default function WeatherForecastDaily({ forecast }) {
    const borderClasses = ['borderRight', 'borderRight', 'borderRight', 'borderRight','borderNone'];

    return (
        <div className="weatherForecastDaily">
            {forecast.map((f, i) => {
              const cleanMonth = f.date.month.replace(/\./g, '');
              const clanDdayWeek = f.date.dayWeek.replace(/\./g, '');
              return (
                <span key={i} className={'weatherForecastDaily_item ' + borderClasses[i]}>
                  <span className="main_text">
                    <div>{capitalize(cleanMonth)} / {f.date.dayNumber}</div>
                    <div>{capitalize(clanDdayWeek)}</div>
                  </span>
                  <span className={'icon ' + f.iconCode}></span>
                  <span className="description">{f.text}</span>
                  <span className="text_info">
                    <div className="min">{f.temp.min.value} °{f.temp.min.unit}</div>
                    <div className="max">{f.temp.max.value} °{f.temp.max.unit}</div>
                    {
                      (f.precipitationProbability && f.precipitationProbability > 0)
                      ? <div><FontAwesomeIcon icon={faTint} />  {f.precipitationProbability} %</div> : <div>&nbsp;</div>
                    }
                  </span>
                </span>
              )})}
        </div>
    )
}
