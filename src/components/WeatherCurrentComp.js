import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTint, 
    faCompressArrowsAlt, 
    faSun, 
    faWind, 
    faUmbrella, 
    faMoon, 
    faAdjust 
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';

function WeatherCurrentComp(
    {   uv,
        humidity,
        pressure,
        wind,
        sunRise, 
        sunSet, 
        dayLight,
        moon 
    }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp">
            { uv && <div className="weatherCurrentComp_item borderAll">
                <div><FontAwesomeIcon icon={faUmbrella} /> UV {uv?.index}</div>
                {
                    uv?.index > 0 ? 
                    <div>{uv?.text}</div> : <></>
                }
            </div> }
            { humidity && <div className="weatherCurrentComp_item borderAll">
                <div><FontAwesomeIcon icon={faTint} /> {t("Humidity")}</div>
                {
                    humidity > 0 ?
                    <div>{humidity} %</div> : <></>
                }
            </div> }
            { pressure && <div className="weatherCurrentComp_item borderAll">
                <div><FontAwesomeIcon icon={faCompressArrowsAlt} /> {t("Pressure")}</div>
                <div>{pressure?.value} {pressure?.unit}</div>
            </div> }
            { wind && <div className="weatherCurrentComp_item borderAll">
                <div><FontAwesomeIcon icon={faWind} /> {t("Wind")}:</div>
                {
                    wind?.speed?.value > 0 ?
                    (<>
                        
                        <div>{wind?.speed?.value} {wind?.speed?.unit}</div>
                        <div>{wind?.direction}</div>
                    </>) : <></>
                }
            </div> }
            { (sunRise || sunSet || dayLight) && 
                <div className="weatherCurrentComp_item sunInfo borderAll">
                    <div>{t("DayLigth")}</div>
                    <div className="sunrise">
                        <span><FontAwesomeIcon icon={faSun} /> {}</span>
                        <span>{sunRise}</span>
                    </div>
                    <span className="sunset">
                        <span><FontAwesomeIcon icon={faMoon} /> {}</span>
                        <span>{sunSet}</span>
                    </span>
                    <span className="dayLight">
                        <span><FontAwesomeIcon icon={faAdjust} /> {}</span>
                        <span>{dayLight} Hrs</span>
                    </span>
                </div> 
            }
            { moon && <div className='weatherCurrentComp_item moonInfo borderAll'>
                <div className="d-flex w-100 align-items-center justify-content-evenly">
                    <div className={'moon ' + moon.class}>
                        <div className='disc'></div>
                    </div>
                    <span>{(moon.phase * 100) + '%'}</span>
                </div>
                <div>{moon.text}</div>
            </div> }
        </div>
    );
}

export default withTranslation()(WeatherCurrentComp); 
