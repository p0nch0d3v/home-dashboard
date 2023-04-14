import { useTranslation } from 'react-i18next';

function Pressure({ pressure }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp_item borderAll">
            <div>
                <span>↓</span>
                {' '}
                {t("Pressure")}
            </div>
            <div>{pressure?.value} {pressure?.unit}</div>
        </div>
    );
}

export default Pressure;