import { useTranslation } from 'react-i18next';

function Humidity({ humidity }) {
    const { t } = useTranslation();

    return (
        <div className="weatherCurrentComp_item borderAll">
            <div className='uppercase'>
                <span>💧</span> 
                {' '}
                {t("Humidity")}
            </div>
            {
                humidity > 0 ?
                    <div>{humidity} %</div> : <></>
            }
        </div>
    );
}

export default Humidity;