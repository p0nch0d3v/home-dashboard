import React from 'react';
import './LastTweetBy.scss';

function LastTweetBy({ tweetInfo }) {
    const fontSizes = [
        { minChar: 141, maxChar: 285, fontSize: 5.25 },
        { minChar: 71, maxChar: 140, fontSize: 7.5 },
        { minChar: 36, maxChar: 70, fontSize: 10 },
        { minChar: 1, maxChar: 35, fontSize: 15 }
    ]

    const fontSize = fontSizes.find((v) => { return tweetInfo?.lastTweet?.textCount >= v.minChar && tweetInfo?.lastTweet?.textCount <= v.maxChar })

    return (
        <div className='tweetInfo'>
            <div className='user'>
                <span className='user_name'>{tweetInfo?.user.name}</span>
                <span className='username'>(@{tweetInfo?.user.username})</span>
            </div>
            <div className='content' style={{ fontSize: `${fontSize.fontSize}vh` }}>{tweetInfo?.lastTweet?.text}</div>
            <div className='dateTime'>{tweetInfo?.lastTweet?.createdAtFormatted} ({tweetInfo?.lastTweet?.since})</div>
        </div>
    );
}

export default LastTweetBy;