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

    const weekDayClasses = (dayValue, weekDay) => {
        return 'weekDay' 
            + (date.date() === dayValue ? ' today' : '')
            + (weekDay === 0 || weekDay === 6 ? ' weekend' : '');
    } 

    return (
        <div className="container-fluid calendar">
            <div className="row">
                <div className="col">
                    {date.format('MMM / YYYY')}
                </div>
            </div>
            
            <div className="row header">
                <div className="col">Su</div>
                <div className="col">Mo</div>
                <div className="col">Tu</div>
                <div className="col">We</div>
                <div className="col">Th</div>
                <div className="col">Fr</div>
                <div className="col">Sa</div>
            </div>
            
            {rows.map((weekValue, weekIndex) => {
                return (
                    <div className="row week">
                        {weekValue.map((dayValue, dayIndex) =>{
                            return (
                                <div className="col">
                                    <span className={`weekDay ${weekDayClasses(dayValue, dayIndex)}` }>
                                        {dayValue ? dayValue : ''}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                );
            })}
        </div>
    )
};
