import { sendMessage } from "../handlers/sendMessage";

export const execute = (username: string, channelId: number) => {
  sendMessage(channelId, `@${username}, this is test command!`);
};
