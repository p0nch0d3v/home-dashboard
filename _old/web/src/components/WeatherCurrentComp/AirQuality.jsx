import { useTranslation } from 'react-i18next';

function AirQuality({ aqi, text, aqiColor }) {
    const { t } = useTranslation();

    return (
        <div className="airQuality weatherCurrentComp_item borderAll">
            <div className='uppercase'>
                <span>🍃</span>
                {' '}
                {t("AirQuality")}
            </div>
            <div style={{ backgroundColor: aqiColor }}>{text}</div>
        </div>
    );
}

export default AirQuality;