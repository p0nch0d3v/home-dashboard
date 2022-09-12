import React from 'react';
import './DateTime.scss';

export default function DateTime({ time, weekDay, date }){
    return (
        <div className="datetime">
            <div className="time">{time}</div>
            <div className="weekDay">{weekDay}{' '}</div>
            <div className="date">{date}</div>
        </div>
    )
}
