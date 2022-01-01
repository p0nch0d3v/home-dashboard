import React from 'react';

export default function MainHeader({ date, time, temp, feelTemp, iconCode, onTouchEnd }){
    return (
        <div className="main-header" onTouchEnd={onTouchEnd}>
            <div className="main-header_time">{time}</div>
            <div className="main-header_temp">
                {
                    iconCode ? <span style={{marginRight: '1rem'}} className={'icon ' + iconCode}></span>
                    : <></>
                }
                <span>{temp}</span>
                {feelTemp !== temp ? <span>&nbsp;({feelTemp})</span> : <></>}
            </div>
            <div className="main-header_date">{date}</div>
         </div>
    )
}
