require("dotenv").config();
import { Client, Intents } from "discord.js";

const CHANNEL_ID = "997518185785991229" as const;

const client = new Client({
  // https://discordjs.guide/popular-topics/intents.html#enabling-intents
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("voiceStateUpdate", (oldState, newState) => {
  if (oldState.channelId === null && newState.channelId !== null) {
    if (oldState.member === null) return;

    const channel = oldState.member.guild.channels.cache.get(CHANNEL_ID);

    // https://discordjs.guide/additional-info/changes-in-v13.html#channel
    if (channel && channel.type === "GUILD_TEXT") {
      channel.send(
        `**参加** ${oldState.member.user.username}さんが入室しました。`
      );
    }
  } else if (oldState.channelId !== null && newState.channelId === null) {
    if (newState.member === null) return;

    const channel = newState.member.guild.channels.cache.get(CHANNEL_ID);

    if (channel && channel.type === "GUILD_TEXT") {
      channel.send(
        `**退出** ${newState.member.user.username}さんが退出しました。`
      );
    }
  }
});

client.login(process.env.TOKEN!);
client.once("ready", () => {
  console.log("起動完了");
});
