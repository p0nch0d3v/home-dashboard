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
    const value = localStorage[key];
    return value ? JSON.parse(value) : null;
}

export function setStorageValue(key, value){
    if (value) {
        localStorage[key] = JSON.stringify(value);
    }
}
