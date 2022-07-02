import moment from 'moment';
import 'moment/locale/es';
import 'moment/dist/locale/es';
import 'moment-timezone';
import { capitalize } from '../helpers';
import { GetConfigurations } from './ConfigService';

export function GetDate(timezone) {
    moment.locale(GetConfigurations().language);
    let newMomentDate = moment();
    if (timezone) {
        newMomentDate = moment.utc().tz(timezone);
    }

    let formattedDate = newMomentDate.format('DD / MMM / YYYY');
    formattedDate = formattedDate.replace(/\./g, '');
    formattedDate = capitalize(formattedDate);
    const weekDay = capitalize(newMomentDate.format('dddd'));

    const dayOfYear = newMomentDate.dayOfYear();
    const remainingDaysOfYear = newMomentDate.endOf('year').dayOfYear() - dayOfYear;

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
