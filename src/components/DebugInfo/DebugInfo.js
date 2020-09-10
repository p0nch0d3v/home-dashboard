import React from 'react';
import {
    StorageKeys,
    getStorageValue
} from '../../services/DataService';

export default function DebugInfo(props){
    const currentCondition = new Date(getStorageValue(StorageKeys.currentConditions).EpochTime * 1000);
    const forecastHourly = new Date(getStorageValue(StorageKeys.forecastHourly)[0].EpochDateTime * 1000);
    const forecastDaily = new Date(getStorageValue(StorageKeys.forecastDaily)[1].EpochDate * 1000);
    return (
      <div>
        <h1>Debug</h1>
        <br/>
        <h1>Conditions:</h1>
        <h1>{currentCondition.toString()}</h1>
        <br/>
        <h1>Hourly:</h1>
        <h1>{forecastHourly.toString()}</h1>
        <br/>
        <h1>Daily:</h1>
        <h1>{forecastDaily.toString()}</h1>
      </div>
    );
};
