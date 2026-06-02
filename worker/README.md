# Instagram Feed Worker

This Cloudflare Worker connects the TV display to the official Instagram API without exposing the access token in the browser.

## What You Need From Meta

The Instagram account must be a professional account, either Business or Creator.

In Meta for Developers:

1. Create or open a Business type app.
2. Go to `Instagram > API setup with Instagram business login`.
3. Generate a token for the Instagram account.
4. Get the Instagram professional account user ID by calling:

```txt
https://graph.instagram.com/v21.0/me?fields=user_id,username&access_token=YOUR_TOKEN
```

Use the returned `user_id` as `IG_USER_ID`.

## Cloudflare Worker Settings

Create a Worker and paste `instagram-feed-worker.js`.

Set these Worker secrets:

```txt
IG_ACCESS_TOKEN = your Meta Instagram access token
IG_USER_ID = your Instagram professional account user_id
```

Set these Worker variables:

```txt
IG_GRAPH_VERSION = v21.0
ALLOWED_ORIGIN = https://display.xtreme-systems.com
```

Recommended custom domain:

```txt
instagram-feed.xtreme-systems.com
```

The TV page expects this endpoint:

```txt
https://instagram-feed.xtreme-systems.com/instagram-feed?limit=6
```

## Test

Open:

```txt
https://instagram-feed.xtreme-systems.com/health
```

It should return:

```json
{"ok":true,"service":"xtremesystems-instagram-feed","message":"Ready"}
```

Then open:

```txt
https://instagram-feed.xtreme-systems.com/instagram-feed?limit=6
```

It should return:

```json
{"posts":[{"image":"...","caption":"...","url":"...","tag":"Instagram"}]}
```
