# XtremeSystem Display - GitHub Pages

This repository layout is designed for the display subdomain:

```txt
https://display.xtreme-systems.com/
```

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
