import moment from 'moment';
import { capitalize } from '../helpers';

const localeLang =  import.meta.env.REACT_APP_LOCALE_LANG || 'en';
moment.locale(localeLang);

export function GetDate(timezone) {
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
    let now = moment();
    if (timezone) {
        now = moment.utc().tz(timezone);
    }
    const newTime = now.format('hh:mm A');
    return newTime;
}
