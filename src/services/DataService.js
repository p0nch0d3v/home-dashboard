export const StorageKeys = {
    ipInfo: 'ipInfo',
    cityInfo: 'cityInfo',
    locationInfo: 'locationInfo',
    currentConditions: 'currentConditions',
    forecastHourly: 'forecastHourly',
    forecastDaily: 'forecastDaily',
    exchangeRate: 'exchangeRate',
    lastUpdate: {
        conditions: 'lastConditionUpdate',
        forecastHourly: 'lastforecastHourlyUpdate',
        forecastDaily: 'lastforecastDailyUpdate',
        exchangeRate: 'lastExchangeRateUpdate'
    },
    session: 'session',
    local: 'local'
};

export function getStorageValue(key, storage = StorageKeys.session) {
    const value = storage === StorageKeys.local ? localStorage.getItem(key) : localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function setStorageValue(key, value, storage = StorageKeys.session) {
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
