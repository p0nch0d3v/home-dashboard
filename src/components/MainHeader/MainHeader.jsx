import React from 'react';
import './MainHeader.scss';

export default function MainHeader({ date, time, temp, feelTemp, iconCode, onTouchEnd, className }){
    const separator = <span className='v-separator'></span>;
    const items = [];
    if (time) {
        items.push(<div className="time">{time}</div>);
    }
    if (temp && feelTemp && iconCode) {
        items.push( 
            <div className="temp">
            {
                iconCode ? <span style={{marginRight: '0.5rem'}} className={'icon ' + iconCode}></span>
                : <></>
            }
            <span>{temp}</span>
            {feelTemp !== temp ? <span>&nbsp;({feelTemp})</span> : <></>}
            </div>
        );
    }
    if (date) {
        items.push(<div className="date">{date}</div>);
    }
    
    return (
        <div className={ className +  ' main-header' }
            onTouchEnd={onTouchEnd}>
             { items.map((value, index) => {
                return <>
                        {value}
                        {value && items.length > 1 && (index + 1) < items.length ? separator : <></>}
                    </>
              }) }
         </div>
    )
}
