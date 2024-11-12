import axios from 'axios';
import { 
    getStorageValue, 
    StorageKeys, 
    setStorageValue 
} from './DataService';

export async function getExchangeRate(force = false) {
    let exchangeRates = getStorageValue(StorageKeys.exchangeRate);
    if (exchangeRates && force === false) {
        return exchangeRates;
    } else {
        const apikey = import.meta.env.REACT_APP_EXCHANGERATE_API_KEY;
        const url = `https://v6.exchangerate-api.com/v6/${apikey}/latest/MXN`;
        var r = await axios({
            method: 'GET',
            url: url
        }).then((r) => {
            return r.data.conversion_rates;
        }).catch((e) => {
            return {};
        });

        exchangeRates = [
            { rate: 'USD', value: (1 / (r.USD ? r.USD : 1)).toFixed(2) },
            { rate: 'EUR', value: (1 / (r.EUR ? r.EUR : 1)).toFixed(2) },
            { rate: 'CAD', value: (1 / (r.CAD ? r.CAD : 1)).toFixed(2) }
        ];

        setStorageValue(StorageKeys.exchangeRate, exchangeRates);
        setStorageValue(StorageKeys.lastUpdate.exchangeRate, Date.now());
    }

    return exchangeRates;
}