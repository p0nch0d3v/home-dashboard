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

    let newDate = newMomentDate.format('DD / MMM / YYYY');
    newDate = newDate.replace(/\./g, '');
    newDate = capitalize(newDate);
    const newWeekDay = capitalize(newMomentDate.format('dddd'));

    return {
        date: newMomentDate,
        formattedDate: newDate,
        weekDay: newWeekDay
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
