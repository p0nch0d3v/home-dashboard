import React from 'react';
import './DateTime.scss';

export default function DateTime(props){
    return (
        <div className="datetime">
            <div className="time">{props.time}</div>
            <div className="weekDay">{props.weekDay}</div>
            <div className="date">{props.date}</div>
        </div>
    )
}
