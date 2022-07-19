# discord bot sample

.env に記載されたトークン(`DISCORD_TOKEN`)で discord bot を起動します。

bot は[Discord DEVELOPER PORTAL](https://discord.com/developers/applications)から作成し、トークンを取得してください。

```bash
# local
npm i
npm start

# docker
docker build . -t discord-bot
docker run -d discord-bot
```
