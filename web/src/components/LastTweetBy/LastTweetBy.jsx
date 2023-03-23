import React from 'react';
import './LastTweetBy.scss';

function LastTweetBy({ tweetInfo }) {
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

    const fontSize = fontSizes.find((v) => { return tweetInfo?.lastTweet?.textCount >= v.minChar && tweetInfo?.lastTweet?.textCount <= v.maxChar })

    return (
        <div className='tweetInfo'>
            <div className='user'>
                <span className='user_name'>{tweetInfo?.user.name}</span>
                <span className='username'>(@{tweetInfo?.user.username})</span>
            </div>
            <div className='content' style={{ fontSize: `${fontSize?.fontSize}vh` }}>{tweetInfo?.lastTweet?.text}</div>
            <div className='dateTime'>{tweetInfo?.lastTweet?.createdAtFormatted} ({tweetInfo?.lastTweet?.since})</div>
        </div>
    );
}

export default LastTweetBy;