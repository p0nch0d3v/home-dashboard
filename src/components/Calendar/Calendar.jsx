import React from 'react';
import moment from 'moment';
import 'moment/locale/es';
import 'moment/dist/locale/es';
import { useTranslation, withTranslation } from 'react-i18next';
import { capitalize } from '../../helpers';
import './Calendar.scss';
import { GetConfigurations } from '../../services/ConfigService';

function Calendar({ date }) {
    moment.locale(GetConfigurations().language);
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
            + (weekDay === 0 || weekDay === 6 ? ' weekend' : '')
            + (dayValue < date.date() ? ' pastDay' : '');
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

export default withTranslation()(Calendar);
