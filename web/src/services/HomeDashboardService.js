import axios from "axios";
import dayjs from 'dayjs/esm/index.js'
import 'dayjs/esm/locale/es'
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';

import {consoleDebug} from '../helpers'

import { GetConfigurations } from "./ConfigService";
import { getStorageValue, setStorageValue, StorageKeys } from "./DataService";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

export async function GetLastTweetBy(force = false) {
    dayjs.locale(GetConfigurations().language);

    const apiUrl = GetConfigurations().HOMEDASHBOARD_API_URL;
    const apiKey = GetConfigurations().HOMEDASHBOARD_API_KEY;
    const username = GetConfigurations().TWITTER_USERNAME;

    let lastTweetByInfo = getStorageValue(StorageKeys.lastTweetBy);

    if ((!lastTweetByInfo || force) && (apiUrl && apiKey && username)) {
        consoleDebug('Calling Get Last Tweet By');
        let lastTweetBy = await axios({
            method: 'GET',
            headers: {
                'access_token': apiKey,
                'accept': 'application/json',
                'Access-Control-Request-Method': 'GET'
            },
            url: `${apiUrl}/last_tweet_by?username=${username}&access_token=${apiKey}`
        }).then(r => r.data);

        lastTweetByInfo = {
            user: {
                name: lastTweetBy.user.name,
                username: lastTweetBy.user.username
            },
            lastTweet: {
                text: lastTweetBy.tweets[0].text,
                createdAt: lastTweetBy.tweets[0].created_at,
                createdAtFormatted: dayjs(lastTweetBy.tweets[0].created_at).format('LLLL'),
                since: dayjs(lastTweetBy.tweets[0].created_at).fromNow(true)
            }
        };

        setStorageValue(StorageKeys.lastTweetBy, lastTweetByInfo);
    }

    if (lastTweetByInfo && lastTweetByInfo?.lastTweet) {
        lastTweetByInfo.lastTweet.since = dayjs(lastTweetByInfo?.lastTweet?.createdAt).fromNow(true);
    }
    
    setStorageValue(StorageKeys.lastTweetBy, lastTweetByInfo);
    setStorageValue(StorageKeys.lastUpdate.lastTweetBy, Date.now());

    return lastTweetByInfo;
}
