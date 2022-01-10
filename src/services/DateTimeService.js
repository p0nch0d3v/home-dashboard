import moment from 'moment';
import { capitalize } from '../helpers';

const localeLang = process.env.REACT_APP_LOCALE_LANG || 'en';
moment.locale(localeLang);

export function GetDate(timezone) {
    if (timezone) {
        const newMomentDate = moment.utc().tz(timezone);
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
    return null;
}

export function GetTime(timezone) {
    if (timezone) {
        const now = moment.utc().tz(timezone);
        const newTime = now.format('hh:mm A');
        return newTime;
    }
    return null;
}
