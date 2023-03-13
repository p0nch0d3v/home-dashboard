import React from 'react';
import dayjs from 'dayjs/esm/index.js'
import 'dayjs/esm/locale/es'
import { useTranslation, withTranslation } from 'react-i18next';
import { capitalize } from '../../helpers';
import './Calendar.scss';
import { GetConfigurations } from '../../services/ConfigService';

function Calendar({ date, dayOfYear, remainingDaysOfYear }) {
    dayjs.locale(GetConfigurations().language);
    const startOfMonth = dayjs(date).startOf('month');
    const endOfMonth = dayjs(date).endOf('month');
    let rows = [];
    let pivotWeek = [null, null, null, null, null, null, null];
    let week = [...pivotWeek];
    let pivotDate = dayjs(startOfMonth);

    // Set previous month days
    while(pivotDate.day() > 0)
    {
        pivotDate = pivotDate.add(-1, 'day');
        week[pivotDate.day()] = {year: pivotDate.year(), month: pivotDate.month(), day: pivotDate.date()};
    }
    pivotDate = dayjs(startOfMonth);

    // Set current month days
    do {
        week[pivotDate.day()] = {year: pivotDate.year(), month: pivotDate.month(), day: pivotDate.date()};
        pivotDate = pivotDate.add(1, 'day');
        if (pivotDate.day() === 0) {
            rows.push(week);
            week = [...pivotWeek];
        }
    } while (pivotDate <= endOfMonth);
    pivotDate = pivotDate.add(-1, 'day'); 
    
    // Set next month days
    if (pivotDate.day() >= 0 && pivotDate.day() < 6) {
        while (pivotDate.day() < 6) {
            pivotDate = pivotDate.add(1, 'day');
            week[pivotDate.day()] = {year: pivotDate.year(), month: 
            pivotDate.month(), day: pivotDate.date()};
        }
    }

    rows.push(week);

    const weekDayClasses = (day, weekDay) => {
        let className = 'weekDay';

        if (date.date() === day?.day && date.month() === day?.month && date.year() === day?.year) {
            className += ' today';
        }
        if (weekDay === 0 || weekDay === 6) {
            className += ' weekend';
        }
        if ((day?.day < date.date() && day?.month === date.month() && day?.year === date.year()) ||
            (day?.month < date.month() && day?.year === date.year()) || 
            (day?.year < date.year())) {
            className += ' pastDay';
        }

        return className;
    } 

    const weekDayWrapperClasses = (day, weekDay) => {
        let className = '';
        
        if (day?.month < date.month() || day?.year < date.year()) {
            className += ' borderBottom';
        }
        if (day?.month > date.month() || day?.year > date.year()) {
            className += ' borderTop';
        }
        if (day?.day === new dayjs(startOfMonth).add(-1, 'day').date() && day?.month < date.month()) {
            className += ' borderRight';
        }
        if (day?.day === 1 && day?.month > date.month()) {
            className += ' borderLeft';
        }
        return className;
    }

    let formattedDate = date.format('MMMM / YYYY');
    formattedDate = formattedDate.replace(/\./g, '');
    formattedDate = capitalize(formattedDate);

    const { t } = useTranslation();

    return (
        <div className="container-fluid calendar">
            <div className="row">
                <div className="col">
                    {formattedDate}
                </div>
                <div className="col dayOfYear">
                    {t("Day")} <strong>{dayOfYear}</strong>, {t("Remaining")} <strong>{remainingDaysOfYear}</strong>
                </div>
            </div>
            
            <div className="row header">{}
                <div className="col">{t("Su")}</div>
                <div className="col">{t("Mo")}</div>
                <div className="col">{t("Tu")}</div>
                <div className="col">{t("We")}</div>
                <div className="col">{t("Th")}</div>
                <div className="col">{t("Fr")}</div>
                <div className="col">{t("Sa")}</div>
            </div>
            
            {rows.map((weekValue, weekIndex) => {
                return (
                    <div className="row week">
                        {weekValue.map((day, dayIndex) =>{
                            return (
                                <div className={'col ' + weekDayWrapperClasses(day, dayIndex)}>
                                    <span className={`weekDay ${weekDayClasses(day, dayIndex)}` }>
                                        {day?.day ? day.day : ''}
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

export default withTranslation()(Calendar);
