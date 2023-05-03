import { useTranslation } from 'react-i18next';

function SunInfo({ sunrise, dayLight, sunset }) {
    const { t } = useTranslation();
    
    return (
        <div className="weatherCurrentComp_item sunInfo borderAll">
            <div className='uppercase'>{t("DayLigth")}</div>
            <div className="sunrise">
                <span>🌞</span>
                <span>{sunrise}</span>
            </div>
            <span className="dayLight">
                <span>{dayLight} Hrs</span>
            </span>
            <span className="sunset">
                <span>{sunset}</span>
                <span>🌙</span>
            </span>
        </div>
    );
}

export default SunInfo;