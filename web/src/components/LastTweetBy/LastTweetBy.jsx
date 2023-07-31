import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import './LastTweetBy.scss';

function LastTweetBy({ tweetUser, tweetData }) {
    const fontSizes = [
        { minChar: 271, maxChar: 281, fontSize: 5.5 },
        { minChar: 261, maxChar: 270, fontSize: 5.75 },
        { minChar: 211, maxChar: 260, fontSize: 6 },
        { minChar: 201, maxChar: 210, fontSize: 6.25 },
        { minChar: 191, maxChar: 200, fontSize: 6.5 },
        { minChar: 171, maxChar: 190, fontSize: 6.75 },
        { minChar: 151, maxChar: 170, fontSize: 7 },
        { minChar: 141, maxChar: 150, fontSize: 7.25 },
        { minChar: 131, maxChar: 140, fontSize: 7.5 },
        { minChar: 121, maxChar: 130, fontSize: 7.75 },
        { minChar: 111, maxChar: 120, fontSize: 8 },
        { minChar: 101, maxChar: 110, fontSize: 8.25 },
        { minChar: 91, maxChar: 100, fontSize: 8.5 },
        { minChar: 81, maxChar: 90, fontSize: 8.75 },
        { minChar: 71, maxChar: 80, fontSize: 9.25 },
        { minChar: 61, maxChar: 70, fontSize: 9.75 },
        { minChar: 51, maxChar: 60, fontSize: 10.25 },
        { minChar: 41, maxChar: 50, fontSize: 10.75 },
        { minChar: 31, maxChar: 40, fontSize: 11.25 },
        { minChar: 21, maxChar: 30, fontSize: 13 },
        { minChar: 11, maxChar: 20, fontSize: 17 },
        { minChar: 1, maxChar: 10, fontSize: 21 },
    ]

    const fontSize = fontSizes.find((v) => { return tweetData.textCount >= v.minChar && tweetData.textCount <= v.maxChar })
    const fontSizeStyle = { fontSize: `${fontSize?.fontSize}vh` }

    const { t } = useTranslation();

    return (
        <div className='tweetInfo'>
            <div className='user'>
                <span>
                    <span className='user_name'>{tweetUser.name}</span>
                    <span className='username'>(@{tweetUser.username})</span>
                </span>
                <span style={fontSizeStyle}>{t('Since')}{' '}{tweetData.since}</span>
            </div>
            <div className='content' style={fontSizeStyle}>{tweetData.text}</div>
            <div className='dateTime'>
                <span>{tweetData.createdAtFormatted}</span>
            </div>
        </div>
    );
}

export default withTranslation()(LastTweetBy); 