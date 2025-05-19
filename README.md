# discord-dice-bot

サイコロとおみくじのボット

## Setup

```bash
# .dev.varsの準備 (token等は埋めておく)
cp example.dev.vars .dev.vars

# 事前準備
bun install
bun ./script/builder.ts
bun ./script/register.ts

# secretの設定
bun wrangler secret put DISCORD_APPLICATION_ID
bun wrangler secret put DISCORD_PUBLIC_KEY
bun wrangler secret put DISCORD_TOKEN
```

## Running locally

```bash
bun dev
cloudflared tunnel --url localhost:8787
```

- cloudflaredで発行されたエンドポイントをApplicationの `Interactions Endpoint URL` に登録すること

## Deployment

```bash
bun wrangler deploy
```

- workersのURLをApplicationの `Interactions Endpoint URL` に登録すること

## Notes

- OAuth2 URL
  - Scopes
    - `bot`
    - `applications.commands`
  - Bot Permissions
    - `Send Messages`
    - `Use Slash Commands`
