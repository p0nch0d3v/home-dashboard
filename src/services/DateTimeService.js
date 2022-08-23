import moment from 'moment';
import 'moment/locale/es';
import 'moment/dist/locale/es';
import 'moment-timezone';
import { capitalize } from '../helpers';
import { GetConfigurations } from './ConfigService';

export function GetDate(timezone) {
    moment.locale(GetConfigurations().language);
    let newMomentDate = moment();
    let dayOfYearMoment = moment();
    if (timezone) {
        newMomentDate = moment.utc().tz(timezone);
        dayOfYearMoment = moment.utc().tz(timezone);
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
    moment.locale(GetConfigurations().language);
    let now = moment();
    if (timezone) {
        now = moment.utc().tz(timezone);
    }
    const newTime = now.format('hh:mm A');
    return newTime;
}
