import React from 'react';
import './MainHeader.scss';

export default function MainHeader({ date, time, temp, feelTemp, iconCode, onTouchEnd, className }){
    return (
        <div className={ className +  ' main-header' }
            onTouchEnd={onTouchEnd}>
            {
                time ? (
                    <div className="time">{time}</div>
                ) : <></>
            }
            {
                temp && feelTemp && iconCode ? (
                    <div className="temp">
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
                    <div className="date">{date}</div>
                ) : <></>
            }
         </div>
    )
}
