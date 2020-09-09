import React from 'react';

export default function DebugInfo(props){
    return (
      <div className="text-center">
        <h1>Debug</h1>
        <br/>
        <h1>Conditions:</h1>
        <h1>{props.debug.lastUpdate.conditions}</h1>
        <br/>
        <h1>Hourly:</h1>
        <h1>{props.debug.lastUpdate.forecastHourly}</h1>
        <br/>
        <h1>Daily:</h1>
        <h1>{props.debug.lastUpdate.forecastDaily}</h1>
      </div>
    );
};
