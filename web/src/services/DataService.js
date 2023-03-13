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
    local: 'local',
    configuration: 'configuration'
};

export function getStorageValue(key, storage = StorageKeys.local) {
    const value = storage === StorageKeys.local ? localStorage.getItem(key) : sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function setStorageValue(key, value, storage = StorageKeys.local) {
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

export function clearStorageValue(key, storage = StorageKeys.local) {
    if (storage === StorageKeys.local) { 
        localStorage.removeItem(key);
    }
    else {
        sessionStorage.removeItem(key);
    }
}
