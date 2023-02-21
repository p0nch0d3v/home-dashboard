import axios from 'axios';

import { consoleDebug } from '../helpers';

import {
    StorageKeys,
    getStorageValue,
    setStorageValue
} from './DataService';

import { GetConfigurations } from './ConfigService';

export async function getipInfo(force) {
    let ipInfo = getStorageValue(StorageKeys.ipInfo, StorageKeys.local);
    if (!ipInfo || force === true) {
        consoleDebug('Calling Ip Info');
        const ipinfoApiKey = GetConfigurations().IPINFO_API_KEY;
        const url = `https://ipinfo.io?token=${ipinfoApiKey}`
        consoleDebug('getipInfo', 'url', url);
        ipInfo = await axios({
            url: url,
            method: 'GET',
            headers: {
                "Accept": "application/json"
            }
        }).then(r => {
            return r.data;
        }).catch(e => {
            console.error(e); return null;
        });
        setStorageValue(StorageKeys.ipInfo, ipInfo, StorageKeys.local);
    }
    return ipInfo;
}

export async function getLocationInfo(force = false) {
    let locationInfo = getStorageValue(StorageKeys.locationInfo, StorageKeys.local);
    if (locationInfo && force === false) {
        return locationInfo;
    }
    else {
        consoleDebug('Calling Location Info');
        locationInfo = {};
        const ipInfo = await getipInfo(force);

        locationInfo.ip = ipInfo.ip;
        locationInfo.city = ipInfo.city;
        locationInfo.region = ipInfo.region;
        locationInfo.timezone = ipInfo.timezone;

        const position = await getPosition();

        locationInfo.coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        setStorageValue(StorageKeys.locationInfo, locationInfo, StorageKeys.local);
    }

    return locationInfo;
}

function getPosition(options) {
    return new Promise((resolve, reject) => 
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );
}