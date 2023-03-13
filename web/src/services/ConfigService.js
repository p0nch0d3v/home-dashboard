import { StorageKeys, getStorageValue, setStorageValue } from './DataService';
import { Times } from '../constants';

export function GetConfigurations () {
    let config = getStorageValue(StorageKeys.configuration);
    if (!config) {
        SaveConfigurations(GetDefaultConfigurations());
        config = getStorageValue(StorageKeys.configuration);
    }
    return config;
};

export function GetDefaultConfigurations () {
    return {
        language: "en",
        IPINFO_API_KEY: "",
        OPENWEATHERMAP_API_KEY :"",
        EXCHANGERATE_API_KEY: "",
        widgets: {
            DateTime: { 
                time: { value: 20, type: "second", total: (20 * Times.second) }, 
                isActive: true 
            },
            Calendar: { 
                time: { value: 25, type: "second", total: (25 * Times.second) }, 
                isActive: false 
            },
            WeatherCurrent: { 
                time: { value: 20, type: "second", total: (20 * Times.second) }, 
                isActive: false 
            },
            WeatherCurrentComp: { 
                time: { value: 20, type: "second", total: (20 * Times.second) }, 
                isActive: false 
            },
            WeatherForecastHourly: { 
                time: { value: 30, type: "second", total: (30 * Times.second) }, 
                isActive: false 
            },
            WeatherForecastDaily: { 
                time: { value: 30, type: "second", total: (30 * Times.second) }, 
                isActive: false 
            },
            ExchangeRate: { 
                time: { value: 5, type: "second", total: (5 * Times.second) }, 
                isActive: false 
            }
        },
        services: {
            GeoLocation: {
                time: { value: 24, type: "hour", total: (24 * Times.hour) }, 
                isActive: false
            },
            WeatherCurrent: {
                time: { value: 10, type: "minute", total: (10 * Times.minute) }, 
                isActive: false
            },
            WeatherForecastHourly: {
                time: { value: 30, type: "minute", total: (30 * Times.minute) }, 
                isActive: false
            },
            WeatherForecastDaily: {
                time: { value: 30, type: "minute", total: (30 * Times.minute) }, 
                isActive: false
            },
            ExchangeRate: {
                time: { value: 12, type: "hour", total: (12 * Times.hour) }, 
                isActive: false
            }
        }
    }
};

export function SaveConfigurations (config) {
    setStorageValue(StorageKeys.configuration, { ...GetDefaultConfigurations(), ...config });
}
