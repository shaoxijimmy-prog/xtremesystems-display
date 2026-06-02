# XtremeSystem Display - GitHub Pages

This repository layout is designed for the display subdomain:

```txt
https://display.xtreme-systems.com/
```

The custom domain now opens the TV display directly instead of redirecting to `/display/`.

## GitHub Pages setup

1. In GitHub, go to `Settings > Pages`.
2. Source: `Deploy from a branch`.
3. Branch: `main`, folder: `/root`.
4. Custom domain: `display.xtreme-systems.com`.

## DNS

In Cloudflare, add this DNS record:

```txt
Type: CNAME
Name: display
Target: shaoxijimmy-prog.github.io
Proxy status: DNS only
```

Keep the existing `lab` record unchanged.

## Chromecast / Mac mini

Open:

```txt
https://display.xtreme-systems.com/
```

Keep the page open full screen. Content can be edited in:

```txt
display/display-config.js
```

## Instagram API

The display is prepared to load Instagram posts from:

```txt
https://instagram-feed.xtreme-systems.com/instagram-feed?limit=6
```

Deploy the Cloudflare Worker in `worker/` and add the Instagram token as Worker secrets. Do not put the token in this GitHub Pages site.
