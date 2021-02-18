import React from 'react';

export default function MainHeader(props){
    return (
        <div className="main-header">
            <div className="main-header_time">{props.time}</div>
            <div className="main-header_temp">
                <span>{props.temp}</span>
                {props.feelTemp !== props.temp ? <span>({props.feelTemp})</span> : null}
            </div>
            <div className="main-header_date">{props.date}</div>
         </div>
    )
}
