import React from 'react';
import './MainHeader.scss';

export default function MainHeader({ date, time, temp, feelTemp, iconCode, uvColor, onTouchEnd, className }) {
    const separator = <span className='v-separator'></span>;
    let items = [];
    if (time) {
        items.push(<div className="time">{time}</div>);
    }
    if (temp && feelTemp) {
        items.push( 
            <div className="temp" style={{ backgroundColor: uvColor }}>
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
