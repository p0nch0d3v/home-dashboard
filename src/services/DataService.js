export const StorageKeys = {
    cityInfo: 'cityInfo',
    currentConditions: 'currentConditions',
    forecastHourly: 'forecastHourly',
    forecastDaily: 'forecastDaily',
    lastUpdate: {
        conditions: 'lastConditionUpdate',
        forecastHourly: 'lastforecastHourlyUpdate',
        forecastDaily: 'lastforecastDailyUpdate'
    }
};

export function getStorageValue(key){
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function setStorageValue(key, value){
    if (value) {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, JSON.stringify(value));
    }
}
