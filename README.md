# XtremeSystem Display - GitHub Pages

This repository layout is designed for:

```txt
https://xtreme-systems.com/display/
```

## GitHub Pages setup

1. In GitHub, go to `Settings > Pages`.
2. Source: `Deploy from a branch`.
3. Branch: `main`, folder: `/root`.
4. Custom domain: `xtreme-systems.com`.

## DNS

For an apex domain, GitHub Pages usually needs these A records:

```txt
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

If you prefer `display.xtreme-systems.com`, use a CNAME record pointing to your GitHub Pages hostname instead, and change the `CNAME` file.

## Chromecast / Mac mini

Open:

```txt
https://xtreme-systems.com/display/
```

Keep the page open full screen. Content can be edited in:

```txt
display/display-config.js
```
