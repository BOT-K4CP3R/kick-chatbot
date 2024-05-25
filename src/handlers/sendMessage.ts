import axios from 'axios';
import config from '../config';

export const sendMessage = async (channelId: number, messageContent: string) => {
    axios.post(`https://kick.com/api/v2/messages/send/${channelId}`,
        {
            content: messageContent,
            type: "message"
        },
        {
            headers: {
                "accept": "application/json, text/plain, */*",
                "authorization": `Bearer ${config.token}`,
                "content-type": "application/json",
                "x-xsrf-token": config.token,
                "cookie": config.cookies,
                "Referer": "https://kick.com/botk4cp3r"
            }
        });
};
