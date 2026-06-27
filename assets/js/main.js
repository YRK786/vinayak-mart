/* =========================================================
   VINAYAK FRUIT & VEGETABLE MART
   Main application logic
   - Cart + wishlist state (localStorage)
   - Reusable card renderers
   - Scroll reveal, sticky header, back-to-top, counters
   - Toast notifications
   Designed to be backend-friendly: swap localStorage/data
   arrays with API calls later without changing the UI.
   ========================================================= */

window.VK = (function () {
  const CART_KEY = "vk_cart";
  const WISH_KEY = "vk_wishlist";
  const C = window.VK_CONFIG || {};
  const cur = (C.currency || "₹");

  /* ---------------- State helpers ---------------- */
  const read = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  };
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  let cart = read(CART_KEY);
  let wishlist = read(WISH_KEY);

  const findProduct = (id) =>
    (window.VK_PRODUCTS || []).find((p) => p.id === Number(id));

  /* ---------------- Toast ---------------- */
  function toast(msg, icon = "bi-check-circle-fill") {
    const wrap = document.getElementById("vkToastWrap");
    if (!wrap) return;
    const el = document.createElement("div");
    el.className = "vk-toast";
    el.innerHTML = `<i class="bi ${icon}"></i> ${msg}`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => el.remove(), 300);
    }, 2200);
  }

  /* ---------------- Cart logic ---------------- */
  function addToCart(id, qty = 1) {
    const product = findProduct(id);
    if (!product) return;
    const existing = cart.find((i) => i.id === Number(id));
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id: Number(id), qty });
    }
    write(CART_KEY, cart);
    updateBadges();
    toast(`${product.name} added to cart`, "bi-cart-check-fill");
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => i.id !== Number(id));
    write(CART_KEY, cart);
    updateBadges();
    renderCartPage();
  }

  function setQty(id, qty) {
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const item = cart.find((i) => i.id === Number(id));
    if (item) {
      item.qty = qty;
      write(CART_KEY, cart);
      updateBadges();
      renderCartPage();
    }
  }

  function cartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function cartItemsDetailed() {
    return cart
      .map((i) => {
        const p = findProduct(i.id);
        return p ? { ...p, qty: i.qty, lineTotal: p.price * i.qty } : null;
      })
      .filter(Boolean);
  }

  function cartSubtotal() {
    return cartItemsDetailed().reduce((s, i) => s + i.lineTotal, 0);
  }

  /* ---------------- Wishlist logic ---------------- */
  function toggleWishlist(id, btn) {
    id = Number(id);
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter((w) => w !== id);
      if (btn) {
        btn.classList.remove("active");
        btn.innerHTML = '<i class="bi bi-heart"></i>';
      }
      toast("Removed from wishlist", "bi-heart");
    } else {
      wishlist.push(id);
      if (btn) {
        btn.classList.add("active");
        btn.innerHTML = '<i class="bi bi-heart-fill"></i>';
      }
      toast("Added to wishlist", "bi-heart-fill");
    }
    write(WISH_KEY, wishlist);
    updateBadges();
  }

  /* ---------------- Badge updates ---------------- */
  function updateBadges() {
    document.querySelectorAll("[data-vk-cart-count]").forEach((el) => {
      el.textContent = cartCount();
    });
    document.querySelectorAll("[data-vk-wishlist-count]").forEach((el) => {
      el.textContent = wishlist.length;
    });
  }

  /* ---------------- Rendering helpers ---------------- */
  function money(n) {
    return cur + Number(n).toLocaleString("en-IN");
  }

  function starsHtml(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<i class="bi ${i <= rating ? "bi-star-fill" : "bi-star"}"></i>`;
    }
    return html;
  }

  function discount(p) {
    if (!p.oldPrice || p.oldPrice <= p.price) return 0;
    return Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  }

  function productCard(p) {
    const wished = wishlist.includes(p.id);
    const off = discount(p);
    const badge = p.badge
      ? `<span class="product-badge">${p.badge}</span>`
      : off
        ? `<span class="product-badge">${off}% OFF</span>`
        : "";
    return `
    <div class="product-card reveal">
      <div class="product-thumb">
        ${badge}
        <div class="product-actions">
          <button class="${wished ? "active" : ""}" aria-label="Add to wishlist"
            onclick="VK.toggleWishlist(${p.id}, this)">
            <i class="bi ${wished ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <button aria-label="Quick view" onclick="VK.quickView(${p.id})">
            <i class="bi bi-eye"></i>
          </button>
        </div>
        <a href="product-details.html?id=${p.id}">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
        </a>
      </div>
      <div class="product-body">
        <span class="product-cat">${p.category}</span>
        <h3 class="product-title h6"><a href="product-details.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">${starsHtml(p.rating)} <span>(${p.reviews})</span></div>
        <div class="product-price">
          <span class="now">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="was">${money(p.oldPrice)}</span>` : ""}
          <span class="text-muted small ms-auto">/ ${p.unit}</span>
        </div>
        <button class="btn btn-vk add-cart" onclick="VK.addToCart(${p.id})">
          <i class="bi bi-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>`;
  }

  function renderProducts(targetId, list, colClass = "col-6 col-md-4 col-lg-3") {
    const target = document.getElementById(targetId);
    if (!target) return;
    if (!list.length) {
      target.innerHTML =
        '<div class="col-12"><div class="empty-state"><i class="bi bi-search"></i><h4 class="mt-3">No products found</h4><p class="text-muted">Try adjusting your filters or search.</p></div></div>';
      return;
    }
    target.innerHTML = list
      .map((p) => `<div class="${colClass}">${productCard(p)}</div>`)
      .join("");
    initReveal();
  }

  function categoryCard(c) {
    return `
    <div class="col-6 col-md-4 col-lg-3">
      <a href="products.html?category=${c.id}" class="category-card reveal">
        <div class="cat-img"><img src="${c.img}" alt="${c.name}" loading="lazy"></div>
        <div class="cat-body">
          <h5>${c.name}</h5>
          <span class="count">${c.count} items</span>
          <span class="explore d-block">Explore <i class="bi bi-arrow-right"></i></span>
        </div>
      </a>
    </div>`;
  }

  /* ---------------- Quick view (modal) ---------------- */
  function quickView(id) {
    const p = findProduct(id);
    if (!p) return;
    let modalEl = document.getElementById("vkQuickView");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.className = "modal fade";
      modalEl.id = "vkQuickView";
      modalEl.tabIndex = -1;
      modalEl.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content" style="border-radius:var(--vk-radius);overflow:hidden">
            <div class="modal-body p-0" id="vkQuickViewBody"></div>
          </div>
        </div>`;
      document.body.appendChild(modalEl);
    }
    const off = discount(p);
    document.getElementById("vkQuickViewBody").innerHTML = `
      <button type="button" class="btn-close position-absolute end-0 m-3" data-bs-dismiss="modal" aria-label="Close" style="z-index:5"></button>
      <div class="row g-0">
        <div class="col-md-6">
          <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;min-height:320px;object-fit:cover">
        </div>
        <div class="col-md-6 p-4">
          <span class="product-cat">${p.category}</span>
          <h3 class="h4 mt-1">${p.name}</h3>
          <div class="product-rating mb-2">${starsHtml(p.rating)} <span>(${p.reviews} reviews)</span></div>
          <div class="product-price mb-3">
            <span class="now">${money(p.price)}</span>
            ${p.oldPrice ? `<span class="was">${money(p.oldPrice)}</span>` : ""}
            ${off ? `<span class="badge bg-danger">${off}% OFF</span>` : ""}
          </div>
          <p class="text-muted">Farm-fresh ${p.name.toLowerCase()} sourced daily, hand-picked for quality and sold at the best market price. Priced per ${p.unit}.</p>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-vk" onclick="VK.addToCart(${p.id})"><i class="bi bi-cart-plus"></i> Add to Cart</button>
            <a href="product-details.html?id=${p.id}" class="btn btn-vk-outline">View Details</a>
          </div>
        </div>
      </div>`;
    new bootstrap.Modal(modalEl).show();
  }

  /* ---------------- Cart page rendering ---------------- */
  function renderCartPage() {
    const body = document.getElementById("cartBody");
    if (!body) return;
    const items = cartItemsDetailed();
    const wrap = document.getElementById("cartWrap");
    const empty = document.getElementById("cartEmpty");

    if (!items.length) {
      if (wrap) wrap.classList.add("d-none");
      if (empty) empty.classList.remove("d-none");
      return;
    }
    if (wrap) wrap.classList.remove("d-none");
    if (empty) empty.classList.add("d-none");

    body.innerHTML = items
      .map(
        (i) => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${i.image}" alt="${i.name}">
            <div>
              <a href="product-details.html?id=${i.id}" class="fw-semibold text-dark d-block">${i.name}</a>
              <small class="text-muted">${i.category}</small>
            </div>
          </div>
        </td>
        <td class="fw-semibold">${money(i.price)}<small class="text-muted">/${i.unit}</small></td>
        <td>
          <div class="qty-selector">
            <button type="button" onclick="VK.setQty(${i.id}, ${i.qty - 1})" aria-label="Decrease">&minus;</button>
            <input type="text" value="${i.qty}" readonly aria-label="Quantity">
            <button type="button" onclick="VK.setQty(${i.id}, ${i.qty + 1})" aria-label="Increase">&plus;</button>
          </div>
        </td>
        <td class="fw-bold text-green">${money(i.lineTotal)}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger border-0" onclick="VK.removeFromCart(${i.id})" aria-label="Remove">
            <i class="bi bi-trash3"></i>
          </button>
        </td>
      </tr>`
      )
      .join("");

    renderSummary("cartSummary");
  }

  function renderSummary(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const subtotal = cartSubtotal();
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40;
    const total = subtotal + shipping;
    el.innerHTML = `
      <h5 class="mb-3">Cart Summary</h5>
      <div class="line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="line"><span>Delivery</span><span>${shipping === 0 ? "Free" : money(shipping)}</span></div>
      <div class="line text-muted small"><span>Items</span><span>${cartCount()}</span></div>
      <div class="line total"><span>Total</span><span>${money(total)}</span></div>
      <a href="checkout.html" class="btn btn-vk w-100 mt-3"><i class="bi bi-bag-check"></i> Proceed to Checkout</a>
      <a href="products.html" class="btn btn-vk-outline w-100 mt-2">Continue Shopping</a>`;
  }

  function applyCoupon(e) {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const code = (input.value || "").trim().toUpperCase();
    if (code === "FRESH10") {
      toast("Coupon FRESH10 applied: 10% off!", "bi-tag-fill");
    } else if (code) {
      toast("Invalid coupon code", "bi-x-circle-fill");
    }
    return false;
  }

  /* ---------------- Checkout summary ---------------- */
  function renderCheckout() {
    const el = document.getElementById("checkoutSummary");
    if (!el) return;
    const items = cartItemsDetailed();
    const subtotal = cartSubtotal();
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 40;
    const total = subtotal + shipping;
    el.innerHTML = `
      ${items.length
        ? items
          .map(
            (i) => `<div class="line"><span>${i.name} <small class="text-muted">× ${i.qty}</small></span><span>${money(i.lineTotal)}</span></div>`
          )
          .join("")
        : '<p class="text-muted">Your cart is empty. <a href="products.html">Shop now</a></p>'
      }
      <hr>
      <div class="line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="line"><span>Delivery</span><span>${shipping === 0 ? "Free" : money(shipping)}</span></div>
      <div class="line total"><span>Total</span><span>${money(total)}</span></div>`;
  }

  /* ---------------- Search ---------------- */
  function search(e) {
    e.preventDefault();
    const input = e.target.querySelector("input");
    const q = (input.value || "").trim();
    if (q) {
      location.href = "products.html?search=" + encodeURIComponent(q);
    }
    return false;
  }

  /* ---------------- Scroll reveal ---------------- */
  let revealObserver;
  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
    }
    document
      .querySelectorAll(".reveal:not(.visible)")
      .forEach((el) => revealObserver.observe(el));
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          let cur = 0;
          const step = target / 60;
          const tick = () => {
            cur += step;
            if (cur >= target) {
              el.textContent = target.toLocaleString("en-IN") + suffix;
            } else {
              el.textContent = Math.floor(cur).toLocaleString("en-IN") + suffix;
              requestAnimationFrame(tick);
            }
          };
          tick();
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  /* ---------------- Global UI behaviour ---------------- */
  function afterComponents() {
    updateBadges();

    // Sticky header shadow
    const header = document.getElementById("siteHeader");
    const backTop = document.getElementById("backToTop");
    const onScroll = () => {
      if (header) header.classList.toggle("scrolled", window.scrollY > 10);
      if (backTop) backTop.classList.toggle("show", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (backTop) {
      backTop.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    }

    initReveal();
    initCounters();

    // Page-specific renderers
    renderCartPage();
    renderCheckout();
  }

  /* ---------------- Public API ---------------- */
  return {
    addToCart,
    removeFromCart,
    setQty,
    toggleWishlist,
    quickView,
    renderProducts,
    productCard,
    categoryCard,
    renderCartPage,
    renderCheckout,
    applyCoupon,
    search,
    initReveal,
    initCounters,
    afterComponents,
    money,
    starsHtml,
    discount,
    cartItemsDetailed,
    findProduct,
    toast,
  };
})();
