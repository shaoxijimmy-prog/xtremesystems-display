(function () {
  const config = window.XTREME_DISPLAY_CONFIG || {};
  const store = config.store || {};

  const safe = (value, fallback = "") => (value === undefined || value === null || value === "" ? fallback : value);
  const qr = (url) => `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(url)}`;

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function updateClock() {
    const now = new Date();
    setText("clock", now.toLocaleTimeString("en-NZ", { hour: "2-digit", minute: "2-digit" }));
    setText("dateLabel", now.toLocaleDateString("en-NZ", { weekday: "long", month: "short", day: "numeric" }));
  }

  function applyStoreDetails() {
    setText("storeName", safe(store.name, "XtremeSystem"));
    setText("storeTagline", safe(store.tagline, "Refurbished and new tech"));
    setText("storeDetails", `${safe(store.location, "Auckland CBD")} | ${safe(store.phone, "09-3751410")}`);

    const websiteQr = document.getElementById("websiteQr");
    const instagramQr = document.getElementById("instagramQr");
    const reviewsQr = document.getElementById("reviewsQr");

    if (websiteQr) websiteQr.src = qr(safe(store.website, "https://xtremesystems.co.nz"));
    if (instagramQr) instagramQr.src = qr(safe(store.instagram, "https://www.instagram.com/xtremesystemnz/"));
    if (reviewsQr) reviewsQr.src = qr(safe(store.googleReviews, "https://www.google.com/maps"));
  }

  async function loadInstagramPosts() {
    if (config.instagramFeedJsonUrl) {
      try {
        const response = await fetch(config.instagramFeedJsonUrl, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          const posts = Array.isArray(data) ? data : data.posts;
          if (Array.isArray(posts) && posts.length) return posts;
        }
      } catch (error) {
        console.warn("Instagram feed unavailable, using manual posts.", error);
      }
    }

    return config.manualInstagramPosts || [];
  }

  async function loadInventoryItems() {
    if (config.shopifyProductsJsonUrl) {
      try {
        const response = await fetch(config.shopifyProductsJsonUrl, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          const products = Array.isArray(data.products) ? data.products : [];
          const items = products
            .filter((product) => product.images && product.images.length)
            .slice(0, 6)
            .map((product) => {
              const variant = product.variants && product.variants[0];
              const price = variant && variant.price ? `NZ$${Number(variant.price).toLocaleString("en-NZ")}` : "View online";
              return {
                title: product.title,
                price,
                image: product.images[0].src,
                url: `${safe(store.website, "https://xtremesystems.co.nz")}/products/${product.handle}`,
              };
            });
          if (items.length) return items;
        }
      } catch (error) {
        console.warn("Shopify products feed unavailable, using manual inventory.", error);
      }
    }

    return config.manualInventory || [];
  }

  function renderInstagram(posts) {
    const stage = document.getElementById("instagramStage");
    if (!stage || !posts.length) return;

    stage.innerHTML = posts
      .map((post, index) => {
        const image = safe(post.image, "");
        const caption = safe(post.caption, "Latest XtremeSystem update");
        const tag = safe(post.tag, "Instagram");
        const url = safe(post.url, safe(store.instagram, "https://www.instagram.com/xtremesystemnz/"));
        return `
          <a class="instagram-slide${index === 0 ? " is-active" : ""}" href="${url}" target="_blank" rel="noreferrer">
            <img alt="${caption.replace(/"/g, "&quot;")}" src="${image}">
            <div class="instagram-caption">
              <span>${tag}</span>
              <strong>${caption}</strong>
            </div>
          </a>
        `;
      })
      .join("");

    rotateElements(stage.querySelectorAll(".instagram-slide"), 6500);
  }

  function renderPromos() {
    const promoStack = document.getElementById("promoStack");
    if (!promoStack) return;

    promoStack.innerHTML = (config.promos || [])
      .map(
        (promo) => `
          <article class="promo-card" data-accent="${safe(promo.accent, "blue")}">
            <span>${safe(promo.label, "Deal")}</span>
            <h3>${safe(promo.title, "Store offer")}</h3>
            <p>${safe(promo.text, "Ask the team for details.")}</p>
          </article>
        `
      )
      .join("");
  }

  function renderInventory(items) {
    const container = document.getElementById("inventoryCards");
    if (!container || !items.length) return;

    renderInventoryWindow(items);

    if (items.length > 3) {
      let offset = 0;
      window.setInterval(() => {
        offset = (offset + 1) % items.length;
        const rotated = [...items.slice(offset), ...items.slice(0, offset)];
        renderInventoryWindow(rotated);
      }, 9000);
    }
  }

  function renderInventoryWindow(items) {
    const container = document.getElementById("inventoryCards");
    if (!container || !items.length) return;

    container.innerHTML = items
      .slice(0, 3)
      .map(
        (item) => `
          <a class="inventory-card" href="${safe(item.url, safe(store.website, "#"))}" target="_blank" rel="noreferrer">
            <img alt="${safe(item.title, "Product").replace(/"/g, "&quot;")}" src="${safe(item.image, "")}">
            <div>
              <strong>${safe(item.title, "Featured product")}</strong>
              <span>${safe(item.price, "View online")}</span>
            </div>
          </a>
        `
      )
      .join("");
  }

  function rotateElements(elements, interval) {
    if (!elements || elements.length < 2) return;
    let activeIndex = 0;
    window.setInterval(() => {
      elements[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % elements.length;
      elements[activeIndex].classList.add("is-active");
    }, interval);
  }

  async function init() {
    applyStoreDetails();
    updateClock();
    window.setInterval(updateClock, 1000);
    renderPromos();
    renderInstagram(await loadInstagramPosts());
    renderInventory(await loadInventoryItems());
  }

  init();
})();
