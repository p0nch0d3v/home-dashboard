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
        wdigets: {
            DateTime:
            { 
                "time": 25 * Times.second, 
                "isActive": true 
            },
            Calendar:
            { 
                "time": 25 * Times.second, 
                "isActive": true 
            },
            WeatherCurrent:
            { 
                "time": 20 * Times.second, 
                "isActive": true 
            },
            WeatherCurrentComp:
            { 
                "time": 20 * Times.second, 
                "isActive": true 
            },
            WeatherForecastHourly:
            { 
                "time": 30 * Times.second, 
                "isActive": true 
            },
            WeatherForecastDaily:
            { 
                "time": 30 * Times.second, 
                "isActive": true 
            },
            ExchangeRate:
            { 
                "time": 5 * Times.second, 
                "isActive": true 
            }
        }
    }
};

export function SaveConfigurations (config) {
    setStorageValue(StorageKeys.configuration, { ...GetDefaultConfigurations(), ...config });
}
