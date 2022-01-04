import React from 'react';
import moment from 'moment';

export default function Calendar({ date }) {
    const startOfMonth = moment(date).startOf('month');
    const endOfMonth = moment(date).endOf('month');
    let rows = [];
    let pivotWeek = [null, null, null, null, null, null, null];
    let week = [...pivotWeek];
    let pivotDate = moment(startOfMonth);
    
    do {
        week[pivotDate.day()] = pivotDate.date();
        pivotDate = pivotDate.add(1, 'day');
        if (pivotDate.day() === 0) {
            rows.push(week);
            week = [...pivotWeek];
        }
    } while (pivotDate <= endOfMonth);

    if (week.indexOf(null) > 0) {
        rows.push(week);
    }

    return (
        <div className="container-fluid calendar">
            <div className="row">
                <div className="col">
                    {date.format('MMM / YYYY')}
                </div>
            </div>
            
            <div className="row">
                <div className="col">S</div>
                <div className="col">M</div>
                <div className="col">T</div>
                <div className="col">W</div>
                <div className="col">T</div>
                <div className="col">F</div>
                <div className="col">S</div>
            </div>
            
            {rows.map((weekValue, weekIndex) => {
                return (
                    <div className="row week">
                        {weekValue.map((dayValue, dayIndex) =>{
                            return (
                                <div className={`col weekDay ${date.date() === dayValue ? 'today' : ''}` }>
                                    {dayValue ? dayValue : ''}
                                </div>
                            )
                        })}
                    </div>
                );
            })}
        </div>
    )
};
