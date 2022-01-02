import { useRef, useEffect }  from 'react';

export function getUvIndexDescription(uv) {
  if (uv >=0 && uv <= 2){
      return "Low";
  }
  else if (uv >= 3 && uv <= 5){
      return "Moderate";
  }
  else if (uv >= 6 && uv <= 7){
      return "High";
  }
  else if (uv >= 8 && uv <= 10){
      return "Very High";
  }
  else if (uv >= 11 ){
      return "Extreme";
  }
  else {
      return "";
  }
}

export function getCardinalDirectionFromDegree (degree) {
  var degreeAndCardinal = [];
  
  degreeAndCardinal.push({min:348.75,	max:360, dir: 'North'});
  degreeAndCardinal.push({min:0,	max:11.25, dir: 'North'});
  degreeAndCardinal.push({min:11.25,	max:33.75, dir: 'North NE'});
  
  degreeAndCardinal.push({min:33.75,	max:56.25, dir: 'North East'});
  degreeAndCardinal.push({min:56.25,	max:78.75, dir: 'East NE'});
  degreeAndCardinal.push({min:78.75,	max:101.25, dir: 'East'});
  degreeAndCardinal.push({min:101.25,	max:123.75, dir: 'East SE'});
  
  degreeAndCardinal.push({min:123.75,	max:146.25, dir: 'South East'});
  degreeAndCardinal.push({min:146.25,	max:168.75, dir: 'South SE'});
  degreeAndCardinal.push({min:168.75,	max:191.25, dir: 'South'});
  degreeAndCardinal.push({min:191.25,	max:213.75, dir: 'South SW'});
  
  degreeAndCardinal.push({min:213.75,	max:236.25, dir: 'South West'});
  degreeAndCardinal.push({min:236.25,	max:258.75, dir: 'West SW'});
  degreeAndCardinal.push({min:258.75,	max:281.25, dir: 'West'});
  degreeAndCardinal.push({min:281.25,	max:303.75, dir: 'West NW'});
  
  degreeAndCardinal.push({min:303.75,	max:326.25, dir: 'North West'});
  degreeAndCardinal.push({min:326.25,	max:348.75, dir: 'North NW'});
  
  for (let i = 0, t = degreeAndCardinal.length; i < t; i++) {
      if (degree >= degreeAndCardinal[i].min && degree <= degreeAndCardinal[i].max) {
          return degreeAndCardinal[i].dir;
      }
  } 
  return degree.toString();
}

export function consoleDebug (message , ...optionalParams) {
  const extraMessage = optionalParams.join(', ');
  var d = new Date();
  console.debug(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`, message, extraMessage);
};

export function useInterval (callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};