# hello kitty chatbot 🎀

Pastel kitty-bow themed chatbot. Email-only login (no password) — first-time
email picks a username, returning email logs straight back in.

## Heads up

This calls the Anthropic API **directly from the browser**, which means your
API key is exposed to anyone who opens dev tools. Fine for a timepass /
localhost project. If you ever put this online for real, put the API call
behind a tiny backend instead.

## Run it

```bash
npm install
cp .env.example .env
# put your real key in .env
npm run dev
```

## Push to GitHub

```bash
git init
git add .
git commit -m "kitty chat"
git branch -M main
git remote add origin https://github.com/HarshThakur54/kitty-chat.git
git push -u origin main
```
