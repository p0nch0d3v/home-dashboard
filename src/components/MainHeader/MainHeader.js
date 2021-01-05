import React from 'react';
import './MainHeader.scss';

export default function MainHeader(props){
    return (
        <div className="main-header">
            <div className="main-header_time">{props.time}</div>
            <div className="main-header_temp">{props.temp}</div>
            <div className="main-header_date">{props.date}</div>
         </div>
    )
}
