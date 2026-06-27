/* =========================================================
   VINAYAK FRUIT & VEGETABLE MART
   Shared UI components (header, footer, floating buttons)
   Injected into every page for a single, consistent design.
   Markup is built here so backend templating can later
   replace it with server-side includes/partials.
   ========================================================= */

(function () {
  const C = window.VK_CONFIG;

  /* ---- Navigation links (single source) ---- */
  const NAV = [
    { label: "Home", href: "/" },
    { label: "About", href: "about.html" },
    { label: "Categories", href: "categories.html" },
    { label: "Products", href: "products.html" },
    { label: "FAQ", href: "faq.html" },
    { label: "Contact", href: "contact.html" },
  ];

  /* Detect current page for active link highlighting */
  const current = (location.pathname.split("/").pop() || "/").toLowerCase();

  const navItems = (extraClass = "") =>
    NAV.map((n) => {
      const active =
        current === n.href.toLowerCase() ||
          (current === "" && n.href === "/")
          ? "active"
          : "";
      return `<li class="nav-item"><a class="nav-link ${active} ${extraClass}" href="${n.href}">${n.label}</a></li>`;
    }).join("");

  /* ---------- TOP BAR + HEADER ---------- */
  function renderHeader() {
    const html = `
    <!-- Top notification bar -->
    <div class="topbar d-none d-md-block">
      <div class="container d-flex justify-content-between align-items-center">
        <div><i class="bi bi-truck"></i> Free home delivery on orders above ₹500 in Gandhidham</div>
        <div class="topbar-contact">
          <span><i class="bi bi-telephone-fill"></i> <a href="tel:${C.phoneRaw ? "+" + C.phoneRaw : C.phone}">${C.phone}</a></span>
          <span><i class="bi bi-geo-alt-fill"></i> Gandhidham, Kutch</span>
        </div>
      </div>
    </div>

    <!-- Main header -->
    <header class="site-header" id="siteHeader">
      <nav class="navbar navbar-expand-lg py-2">
        <div class="container">
          <a class="navbar-brand" href="/" aria-label="${C.brand} home">
            <span class="brand-logo"><i class="bi bi-basket2-fill"></i></span>
            <span class="brand-text">VINAYAK<small>FRUIT &amp; VEG MART</small></span>
          </a>

          <!-- Mobile toggler -->
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav" aria-label="Toggle navigation">
            <i class="bi bi-list fs-2"></i>
          </button>

          <!-- Desktop nav -->
          <div class="d-none d-lg-flex align-items-center gap-4 mx-auto">
            <ul class="navbar-nav flex-row gap-1">
              ${navItems()}
            </ul>
          </div>

          <!-- Desktop search + actions -->
          <div class="d-none d-lg-flex align-items-center gap-3">
            <form class="header-search" role="search" onsubmit="VK.search(event)">
              <input type="search" class="form-control" placeholder="Search products..." aria-label="Search products">
              <button type="submit" aria-label="Search"><i class="bi bi-search"></i></button>
            </form>
            <a href="#" class="header-icon" aria-label="Wishlist" title="Wishlist">
              <i class="bi bi-heart"></i>
              <span class="badge rounded-pill" data-vk-wishlist-count>0</span>
            </a>
            <a href="cart.html" class="header-icon" aria-label="Cart" title="Cart">
              <i class="bi bi-cart3"></i>
              <span class="badge rounded-pill" data-vk-cart-count>0</span>
            </a>
          </div>

          <!-- Mobile quick actions -->
          <a href="cart.html" class="header-icon d-lg-none ms-auto me-2" aria-label="Cart">
            <i class="bi bi-cart3"></i>
            <span class="badge rounded-pill" data-vk-cart-count>0</span>
          </a>
        </div>
      </nav>
    </header>

    <!-- Mobile offcanvas navigation -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title d-flex align-items-center gap-2" id="mobileNavLabel">
          <span class="brand-logo"><i class="bi bi-basket2-fill"></i></span> Vinayak Mart
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <form class="header-search mb-3 w-100" role="search" onsubmit="VK.search(event)">
          <input type="search" class="form-control" placeholder="Search products..." aria-label="Search">
          <button type="submit" aria-label="Search"><i class="bi bi-search"></i></button>
        </form>
        <ul class="navbar-nav">
          ${navItems()}
          <li class="nav-item mt-3">
            <a href="https://wa.me/${C.whatsapp}" class="btn btn-whatsapp w-100" target="_blank" rel="noopener">
              <i class="bi bi-whatsapp"></i> WhatsApp Order
            </a>
          </li>
        </ul>
      </div>
    </div>`;

    const mount = document.getElementById("vk-header");
    if (mount) mount.innerHTML = html;
  }

  /* ---------- FOOTER ---------- */
  function renderFooter() {
    const catLinks = (window.VK_CATEGORIES || [])
      .slice(0, 6)
      .map((c) => `<li><a href="products.html?category=${c.id}">${c.name}</a></li>`)
      .join("");

    const html = `
    <footer class="site-footer">
      <div class="container">
        <div class="row g-4">
          <!-- Brand + about -->
          <div class="col-lg-4 col-md-6">
            <div class="footer-brand">
              <span class="brand-logo"><i class="bi bi-basket2-fill"></i></span>
              <span class="brand-text text-white">VINAYAK<small>FRUIT &amp; VEG MART</small></span>
            </div>
            <p>Your trusted neighbourhood store for fresh fruits and vegetables at the best prices in Gandhidham, Kutch.</p>
            <ul class="footer-contact list-unstyled">
              <li><i class="bi bi-geo-alt-fill"></i> <span>${C.address}</span></li>
              <li><i class="bi bi-telephone-fill"></i> <a href="tel:+${C.phoneRaw}">${C.phone}</a></li>
              <li><i class="bi bi-clock-fill"></i> <span>${C.hours}</span></li>
            </ul>
          </div>

          <!-- Quick links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h5>Quick Links</h5>
            <ul class="list-unstyled footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="about.html">About Us</a></li>
              <li><a href="products.html">Products</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>

          <!-- Categories -->
          <div class="col-lg-2 col-md-6 col-6">
            <h5>Categories</h5>
            <ul class="list-unstyled footer-links">
              ${catLinks}
            </ul>
          </div>

          <!-- Newsletter / social -->
          <div class="col-lg-4 col-md-6">
            <h5>Stay Connected</h5>
            <p>Get daily rate updates and offers on WhatsApp.</p>
            <a href="https://wa.me/${C.whatsapp}" class="btn btn-whatsapp mb-3" target="_blank" rel="noopener">
              <i class="bi bi-whatsapp"></i> Order on WhatsApp
            </a>
            <div class="footer-social d-flex gap-2">
              <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="https://wa.me/${C.whatsapp}" aria-label="WhatsApp" target="_blank" rel="noopener"><i class="bi bi-whatsapp"></i></a>
              <a href="${C.mapLink}" aria-label="Google Maps" target="_blank" rel="noopener"><i class="bi bi-geo-alt"></i></a>
              <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
            </div>
          </div>
        </div>

        <div class="footer-bottom text-center">
          &copy; <span id="vk-year"></span> ${C.brand}. All Rights Reserved. |
          <a href="${C.mapLink}" target="_blank" rel="noopener">View on Google Maps</a>
        </div>
      </div>
    </footer>`;

    const mount = document.getElementById("vk-footer");
    if (mount) mount.innerHTML = html;
    const y = document.getElementById("vk-year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- FLOATING BUTTONS ---------- */
  function renderFloating() {
    const html = `
      <a href="https://wa.me/${C.whatsapp}?text=Hello%20Vinayak%20Mart,%20I%20would%20like%20to%20place%20an%20order"
         class="float-whatsapp" target="_blank" rel="noopener" aria-label="WhatsApp Order">
        <i class="bi bi-whatsapp"></i>
      </a>
      <button class="back-to-top" id="backToTop" aria-label="Back to top">
        <i class="bi bi-arrow-up"></i>
      </button>
      <div class="vk-toast-wrap" id="vkToastWrap" aria-live="polite"></div>`;
    const mount = document.getElementById("vk-floating");
    if (mount) {
      mount.innerHTML = html;
    } else {
      const div = document.createElement("div");
      div.innerHTML = html;
      document.body.appendChild(div);
    }
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
    renderFloating();
    if (window.VK && typeof window.VK.afterComponents === "function") {
      window.VK.afterComponents();
    }
  });
})();
