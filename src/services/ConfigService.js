import { StorageKeys, getStorageValue, setStorageValue } from './DataService';
import { Times } from '../constants';
import { consoleDebug } from '../helpers';

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
            GeoLocation: false,
            WeatherCurrent: false,
            WeatherForecastHourly: false,
            WeatherForecastDaily: false,
            ExchangeRate: false
        }
    }
};

export function SaveConfigurations (config) {
    setStorageValue(StorageKeys.configuration, { ...GetDefaultConfigurations(), ...config });
}
