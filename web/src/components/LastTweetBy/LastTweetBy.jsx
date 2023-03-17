import React from 'react';
import './LastTweetBy.scss';

function LastTweetBy({ tweetInfo }) {
    return (
        <div className='tweetInfo'>
            <div className='user'>
                <span className='user_name'>{tweetInfo?.user.name}</span>
                <span className='username'>(@{tweetInfo?.user.username})</span>
                </div>
            <div className='content'>{tweetInfo?.lastTweet?.text}</div>
            <div className='dateTime'>{tweetInfo?.lastTweet?.createdAtFormatted} ({tweetInfo?.lastTweet?.since})</div>
        </div>
    );
}

export default LastTweetBy;