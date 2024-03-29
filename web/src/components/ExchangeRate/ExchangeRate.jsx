import React from 'react';
import './ExchangeRate.scss'

export default function ExchangeRate(props) {
  const height = 90;
  const mainStyle = { 
    height: `${height}vh`
  };
  
  const itemheight = height / props.rates.length;
  const itemStyle = { 
    height: `${itemheight}vh`
  };
  return (
    <div className="exchangeRates" style={mainStyle}>
      {props.rates.map(function(value, index){
        return (<span className="exchangeRates_item" key={index} style={itemStyle}>
          <span>{value.rate} = {value.value} MXN</span>
        </span>)
      })}
    </div>
  );
}

