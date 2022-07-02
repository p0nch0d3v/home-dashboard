import React from 'react';
import './DateTime.scss';
import { useTranslation, withTranslation } from 'react-i18next';

export default function DateTime({ time, weekDay, date, dayOfYear, remainingDaysOfYear }){
    const { t } = useTranslation();

    return (
        <div className="datetime">
            <div className="time">{time}</div>
            <div className="weekDay">{weekDay}{' '}</div>
            <div className="date">{date}</div>
            <div className="dayOfYear">{t("Day")} {dayOfYear}, {t("Remaining")} {remainingDaysOfYear} </div>
        </div>
    )
}
