require("dotenv").config();
import { Client, Intents } from "discord.js";
import axios from "axios";

const NOTIFY_CHANNEL_ID = "997518185785991229" as const;
const WATCH_CHANNEL_ID = "768854175022448721" as const;

const client = new Client({
  // https://discordjs.guide/popular-topics/intents.html#enabling-intents
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

client.on("voiceStateUpdate", async (oldState, newState) => {

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
