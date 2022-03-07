import React from 'react';
import './MainHeader.scss';

export default function MainHeader({ date, time, temp, feelTemp, iconCode, onTouchEnd }){
    return (
        <div className="main-header" 
        style={{ justifyContent: (!time && !date ? 'center': (!date || !time || !temp ? 'space-evenly': 'space-between')) }}
            onTouchEnd={onTouchEnd}>
            {
                time ? (
                    <div className="main-header_time">{time}</div>
                ) : <></>
            }
            {
                temp && feelTemp && iconCode ? (
                    <div className="main-header_temp">
                        {
                            iconCode ? <span style={{marginRight: '0.5rem'}} className={'icon ' + iconCode}></span>
                            : <></>
                        }
                        <span>{temp}</span>
                        {feelTemp !== temp ? <span>&nbsp;({feelTemp})</span> : <></>}
                    </div>
                ): <></>
            }
            {
                date ? (
                    <div className="main-header_date">{date}</div>
                ) : <></>
            }
         </div>
    )
}
