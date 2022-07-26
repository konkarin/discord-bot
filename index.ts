require("dotenv").config();
import { Client, Intents } from "discord.js";
import axios from "axios";

const NOTIFY_CHANNEL_ID = "927824096182554633" as const;
const WATCH_CHANNEL_IDS = ["928805610928083035"];

const client = new Client({
  // https://discordjs.guide/popular-topics/intents.html#enabling-intents
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (oldState.channelId !== null && newState.channelId === null) {
    return;
  }
  if (
    newState.channelId === null ||
    !WATCH_CHANNEL_IDS.includes(newState.channelId)
  ) {
    return;
  }
  if (newState.member === null) {
    return;
  }

  const channel = newState.member.guild.channels.cache.get(NOTIFY_CHANNEL_ID);

  // https://discordjs.guide/additional-info/changes-in-v13.html#channel
  if (channel !== undefined && channel.type === "GUILD_TEXT") {
    const text = `${newState.member.displayName} さんが ${channel.name} に入室しました🥳`;

    channel.send(text);

    if (process.env.SLACK_WEBHOOK_URL !== undefined) {
      await axios
        .post(process.env.SLACK_WEBHOOK_URL, { text })
        .catch((e) => console.error(e));
    }
  }
});

client.login(process.env.DISCORD_TOKEN!);
client.once("ready", () => {
  console.log("起動完了");
});
