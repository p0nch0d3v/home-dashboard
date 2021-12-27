import React from 'react';

export default function MainHeader(props){
    return (
        <div className="main-header">
            <div className="main-header_time">{props.time}</div>
            <div className="main-header_temp">
                {
                    props.iconCode ? <span style={{marginRight: '1rem'}} className={'icon ' + props.iconCode}></span>
                    : <></>
                }
                <span>{props.temp}</span>
                {props.feelTemp !== props.temp ? <span>&nbsp;({props.feelTemp})</span> : <></>}
            </div>
            <div className="main-header_date">{props.date}</div>
         </div>
    )
}
