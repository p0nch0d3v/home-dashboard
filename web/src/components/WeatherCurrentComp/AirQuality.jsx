import { useTranslation } from 'react-i18next';

function AirQuality({ aqi, text }) {
    const { t } = useTranslation();

    return (
        <div className="airQuality weatherCurrentComp_item borderAll">
            <div>
                <span>🍃</span>
                {' '}
                {t("AirQuality")}:
            </div>
            <div>{text}</div>
        </div>
    );
}

export default AirQuality;