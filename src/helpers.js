import { useRef, useEffect }  from 'react';

export function getUvIndexDescription(uv, t) {
  if (uv >=0 && uv <= 2){
      return t("Low");
  }
  else if (uv >= 3 && uv <= 5){
      return t("Moderate");
  }
  else if (uv >= 6 && uv <= 7){
      return t("High");
  }
  else if (uv >= 8 && uv <= 10){
      return t("VeryHigh");
  }
  else if (uv >= 11 ){
      return t("Extreme");
  }
  else {
      return "";
  }
}

export function getUvIndexColor(uv) {
  if (uv >=1 && uv <= 2){
    return "#00800080"; //Green
  }
  else if (uv >= 3 && uv <= 5){
      return "#FFFF0080"; // Yellow
  }
  else if (uv >= 6 && uv <= 7){
      return "#FFA50080"; // Orange
  }
  else if (uv >= 8 && uv <= 10){
      return "#FF000080"; // Red
  }
  else if (uv >= 11 ){
      return "#FF00FF80"; // Magenta;
  }
  else {
      return "";
  }
}

export function getCardinalDirectionFromDegree (degree, t) {
  var degreeAndCardinal = [];
  
  degreeAndCardinal.push({min:348.75,	max:360, dir: t('North')});
  degreeAndCardinal.push({min:0,	max:11.25, dir: t('North')});
  degreeAndCardinal.push({min:11.25,	max:33.75, dir: `${t('North')} NE`});
  
  degreeAndCardinal.push({min:33.75,	max:56.25, dir: `${t('North')} ${t('East')}`});
  degreeAndCardinal.push({min:56.25,	max:78.75, dir: `${t('East')} NE`});
  degreeAndCardinal.push({min:78.75,	max:101.25, dir: `${t('East')}`});
  degreeAndCardinal.push({min:101.25,	max:123.75, dir: `${t('East')} SE`});
  
  degreeAndCardinal.push({min:123.75,	max:146.25, dir: `${t('South')} ${t('East')}`});
  degreeAndCardinal.push({min:146.25,	max:168.75, dir: `${t('South')} SE`});
  degreeAndCardinal.push({min:168.75,	max:191.25, dir: `${t('South')}`});
  degreeAndCardinal.push({min:191.25,	max:213.75, dir: `${t('South')} ${t('SW')}`});

  degreeAndCardinal.push({min:213.75,	max:236.25, dir: `${t('South')} ${t('West')}`});
  degreeAndCardinal.push({min:236.25,	max:258.75, dir: `${t('West')} ${t('SW')}`});
  degreeAndCardinal.push({min:258.75,	max:281.25, dir: `${t('West')}`});
  degreeAndCardinal.push({min:281.25,	max:303.75, dir: `${t('West')} ${t('NW')}`});
  
  degreeAndCardinal.push({min:303.75,	max:326.25, dir: `${t('North')} ${t('West')}`});
  degreeAndCardinal.push({min:326.25,	max:348.75, dir: `${t('North')} ${t('NW')}`});
  
  for (let i = 0, t = degreeAndCardinal.length; i < t; i++) {
      if (degree >= degreeAndCardinal[i].min && degree <= degreeAndCardinal[i].max) {
          return degreeAndCardinal[i].dir;
      }
  } 
  return degree.toString();
};

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

export function capitalize (string) {
  let words = string.split(' ');
  
  for (let i= 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1); 
  }

  return words.join(' ');
};

export function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

export function getRandomText(min, max) {
  let text = ''
  for (let i = 0; i < rand(min, max); i++) {    
    switch (rand(1,3)) {
      case 1:
        text+= String.fromCharCode(rand(65, 90));
        break;
    case 2:
        text += String.fromCharCode(rand(97, 122))
        break;
    case 3:
        text += ' ';
        break;
    default:
        break;
    }     
  }
  return text;
};

export function getMoonPhaseTextAndClass(moonPhase, t) {
  let text = '';
  let clas = '';
  if (moonPhase === 0 || moonPhase === 1) {
    text = t('NewMoon');
    clas = 'NewMoon';
  }
  else if (moonPhase > 0 && moonPhase < 0.25) {
    text = t('WaxingCrescent');
    clas = 'WaxingCrescent';
  }
  else if (moonPhase === 0.25) {
    text = t('FirstQuarterMoon');
    clas = 'FirstQuarterMoon';
  }
  else if (moonPhase > 0.25 && moonPhase < 0.5) {
    text = t('WaxingGibbous');
    clas = 'WaxingGibbous';
  }
  else if (moonPhase === 0.5) {
    text = t('FullMoon');
    clas = 'FullMoon';
  }
  else if (moonPhase > 0.5 && moonPhase < 0.75) {
    text = t('WaningGibbous');
    clas = 'WaningGibbous';
  }
  else if (moonPhase === 0.75) {
    text = t('LastQuarterMoon');
    clas = 'LastQuarterMoon';
  }
  else if (moonPhase > 0.75) {
    text = t('WaningCrescent');
    clas = 'WaningCrescent';
  }
  return {
    text: text,
    class: clas
  };
}

export const shuffle_array = (array) => {
  let currentIndex = array.length,  randomIndex;
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
