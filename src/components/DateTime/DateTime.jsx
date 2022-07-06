import React from 'react';
import './DateTime.scss';
import { shuffle_array } from '../../helpers'

export default function DateTime({ time, weekDay, date }){
    return (
        <div className="datetime">
            { 
                shuffle_array([
                    <div className="time">{time}</div>,
                    <div className="weekDay">{weekDay}{' '}</div>,
                    <div className="date">{date}</div>
                ]).map((v, i) => {
                    return v    
            })
            }
        </div>
    )
}
