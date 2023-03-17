import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTint,
    faCompressArrowsAlt,
    faSun,
    faWind,
    faUmbrella,
    faMoon,
    faClock
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import './WeatherCurrentComp.scss';
import DayLigth from '../DayLigth/DayLigth';

function WeatherCurrentComp(
    { uv,
        humidity,
        pressure,
        wind,
        sunrise,
        sunset,
        dayLight,
        moon,
        dayLigthData
    }) {
    const { t } = useTranslation();

    const uv_item = (uv && <div className="weatherCurrentComp_item borderAll" style={{ backgroundColor: uv?.color }}>
        <div><FontAwesomeIcon icon={faUmbrella} /> UV {uv?.index}</div>
        {
            uv?.index > 0 ?
                <div>{uv?.text}</div> : <></>
        }
    </div>);

    const humidity_item = (humidity && <div className="weatherCurrentComp_item borderAll">
        <div><FontAwesomeIcon icon={faTint} /> {t("Humidity")}</div>
        {
            humidity > 0 ?
                <div>{humidity} %</div> : <></>
        }
    </div>)

    const pressure_item = (pressure && <div className="weatherCurrentComp_item borderAll">
        <div><FontAwesomeIcon icon={faCompressArrowsAlt} /> {t("Pressure")}</div>
        <div>{pressure?.value} {pressure?.unit}</div>
    </div>);

    const wind_item = (wind && <div className="weatherCurrentComp_item borderAll">
        <div><FontAwesomeIcon icon={faWind} /> {t("Wind")}:</div>
        {
            wind?.speed?.value > 0 ?
                (<>

                    <div>{wind?.speed?.value} {wind?.speed?.unit}</div>
                    <div>{wind?.direction}</div>
                </>) : <></>
        }
    </div>);

    const sunInfo_item = ((sunrise || sunset || dayLight) &&
        <div className="weatherCurrentComp_item sunInfo borderAll">
            <div>{t("DayLigth")}</div>
            <div className="sunrise">
                <span><FontAwesomeIcon icon={faSun} /> { }</span>
                <span>{sunrise}</span>
            </div>
            <span className="sunset">
                <span><FontAwesomeIcon icon={faMoon} /> { }</span>
                <span>{sunset}</span>
            </span>
            <span className="dayLight">
                <span><FontAwesomeIcon icon={faClock} /> { }</span>
                <span>{dayLight} Hrs</span>
            </span>
        </div>);

    const dayLigth_item = ((sunrise || sunset || dayLight) &&
        <div className="weatherCurrentComp_item sunInfo borderAll">
            <DayLigth sunrise={sunrise} sunset={sunset} dayLigthData={dayLigthData} dayLight={dayLight} />
        </div>);

    const moonInfo_item = (moon && <div className='weatherCurrentComp_item moonInfo borderAll'>
        <div className="d-flex w-100 align-items-center justify-content-evenly">
            <div className={'moon ' + moon.class}>
                <div className='disc'></div>
            </div>
        </div>
        <div>{moon.text}</div>
    </div>);

    const min = 0, max = 1;
    const randIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    const dayLigth = [sunInfo_item, dayLigth_item];

    let items_array = [uv_item, humidity_item, pressure_item, wind_item, dayLigth[randIndex], moonInfo_item];

    return (
        <div className="weatherCurrentComp">
            {items_array.map((v, i) => {
                { return v }
            })}
        </div>
    );
}

export default withTranslation()(WeatherCurrentComp); 