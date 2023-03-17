import dayjs from 'dayjs/esm/index.js'
import dayOfYear from 'dayjs/plugin/dayOfYear';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/esm/locale/es'
import { capitalize } from '../helpers';
import { GetConfigurations } from './ConfigService';

dayjs.extend(dayOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

export function GetDate(timezone) {
    dayjs.locale(GetConfigurations().language);
    let newMomentDate = dayjs();
    let dayOfYearMoment = dayjs();
    if (timezone) {
        newMomentDate = dayjs.utc().tz(timezone);
        dayOfYearMoment = dayjs.utc().tz(timezone);
    }

    let formattedDate = newMomentDate.format('DD') + '/' + capitalize(newMomentDate.format('MMM')) + '/' + newMomentDate.format('YYYY');
    formattedDate = formattedDate.replace(/\./g, '');
    const weekDay = capitalize(newMomentDate.format('dddd'));

    const dayOfYear = dayOfYearMoment.dayOfYear();
    const remainingDaysOfYear = dayOfYearMoment.endOf('year').dayOfYear() - dayOfYear;

    return {
        date: newMomentDate,
        formattedDate,
        weekDay,
        dayOfYear,
        remainingDaysOfYear
    }
}

export function GetTime(timezone) {
    dayjs.locale(GetConfigurations().language);
    let now = dayjs();
    if (timezone) {
        now = dayjs.utc().tz(timezone);
    }
    const newTime = now.format('hh:mm A');
    return newTime;
}
