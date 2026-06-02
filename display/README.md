# XtremeSystem Store Display

Static TV display page for Chromecast / Mac mini.

## How to use on the shop TV

Open:

```txt
https://xtreme-systems.com/display/
```

## How to update content

Edit `display-config.js`.

- `promos`: controls Today Special, Clearance, Trade-in and Ex-Lease cards.
- `manualInstagramPosts`: fallback Instagram-style posts.
- `manualInventory`: fallback stock cards.
- `store`: QR code links, phone, address and social URLs.

## Instagram auto feed

The page is ready for an automatic Instagram feed, but Instagram requires an API token or a small feed/proxy service.

When ready, set:

```js
instagramFeedJsonUrl: "https://your-feed-url/posts.json"
```

Expected JSON:

```json
[
  {
    "image": "https://...",
    "caption": "Post caption",
    "url": "https://instagram.com/...",
    "tag": "New stock"
  }
]
```

## Shopify inventory auto feed

The page tries to load:

```txt
https://xtremesystems.co.nz/products.json?limit=24
```

If the browser blocks that request or no products are found, it uses `manualInventory`.
