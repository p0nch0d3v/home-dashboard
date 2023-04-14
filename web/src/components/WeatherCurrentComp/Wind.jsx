import { useTranslation } from 'react-i18next';

function Wind({ wind }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp_item borderAll">
            <div>
                <span>💨</span>
                {' '}
                {t("Wind")}
            </div>
            {
                wind?.speed?.value > 0 ?
                    (<>

                        <div>{wind?.speed?.value} {wind?.speed?.unit}</div>
                        <div>{wind?.direction}</div>
                    </>) : <></>
            }
        </div>
    );
}

export default Wind;