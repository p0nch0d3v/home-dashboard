export const StorageKeys = {
    ipInfo: 'ipInfo',
    cityInfo: 'cityInfo',
    locationInfo: 'locationInfo',
    currentConditions: 'currentConditions',
    forecastHourly: 'forecastHourly',
    forecastDaily: 'forecastDaily',
    lastUpdate: {
        conditions: 'lastConditionUpdate',
        forecastHourly: 'lastforecastHourlyUpdate',
        forecastDaily: 'lastforecastDailyUpdate'
    },
    session: 'session',
    local: 'local'
};

export function getStorageValue(storage = StorageKeys.session, key) {
    const value = storage === StorageKeys.local ? localStorage.getItem(key) : localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function setStorageValue(storage = StorageKeys.session, key, value) {
    if (value) {
        if (storage === StorageKeys.local) { 
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify(value));
        }
        else {
            sessionStorage.removeItem(key);
             sessionStorage.setItem(key, JSON.stringify(value));
        }
    }
}
