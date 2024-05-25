import WebSocket from "ws";
import fs from "fs";
import path from "path";

import { MessageData, MessageEvent } from "@/types/events";

import { runtimeChannelData } from "../utils/index";

let responseEvents: { [channelId: string]: number } = {};

const messageParser = (message: string) => {
  const messageEventJSON: MessageEvent = JSON.parse(message);
  if (messageEventJSON.event === "App\\Events\\ChatMessageEvent") {
    const data: MessageData = JSON.parse(messageEventJSON.data);
    const message = data.content;
    const channelId = data.chatroom_id;
    const username = data.sender.username;
    const emoteRegex = /\[emote:\d+:[^\]]+\]/g;
    const channelName = runtimeChannelData.get(channelId);

    try {
      if (message.match(emoteRegex)) {
        const processedMsg = message.replace(emoteRegex, (match: any) => {
          const parts = match.substring(7, match.length - 1).split(":");
          return parts[1];
        });
        console.log(`${channelName} | ${username}: ${processedMsg}`);
      } else {
        console.log(`${channelName} | ${username}: ${message}`);
      }
    } catch (error) {
      console.log("Message filter error:", error);
    }
  }
};

const handleCommand = (command: string, user: string, channelId: number) => {
  const commandFilePath = path.resolve(__dirname, `../commands/${command}.ts`);
  if (fs.existsSync(commandFilePath)) {
    const commandHandler = require(commandFilePath);
    commandHandler.execute(user, channelId);
  } else {
    console.log(`Command '${command}' not found.`);
  }
};

export const onMessage = (messageEvent: WebSocket.Data, socket: any) => {
  const message = messageEvent.toString();
  messageParser(message);

  const messageEventJSON: MessageEvent = JSON.parse(message);
  const data: MessageData = JSON.parse(messageEventJSON.data);
  const channelId = data.chatroom_id;
  const user = data.sender;
  const username = user ? user.username : "Brak nazwy użytkownika";

  try {
    const messageData = JSON.parse(message);

    if (messageData && typeof messageData.data === 'string') {
      const eventData = JSON.parse(messageData.data);

      if (eventData && eventData.content && typeof eventData.content === 'string') {
        const messageContent = eventData.content;

        if (messageContent.startsWith("!")) {
          const [command, ...args] = messageContent.slice(1).split(" ");

          handleCommand(command, username, channelId);
        }
      }
    }
  } catch (error) {
    console.log("Error parsing message data:", error);
  }

  eventCalculation(message);
};


function eventCalculation(message: string) {
  const messageEventJSON: MessageEvent = JSON.parse(message);
  if (messageEventJSON.event === "App\\Events\\ChatMessageEvent") {
    const channelId = messageEventJSON.channel;
    responseEvents[channelId] = (responseEvents[channelId] || 0) + 1;
  }
}
