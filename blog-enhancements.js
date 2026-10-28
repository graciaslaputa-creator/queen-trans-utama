(function () {
  "use strict";

  function qt(value) {
    return window.QueenTransI18n ? window.QueenTransI18n.t(value) : value;
  }

  function qtf(indonesian, english, chinese) {
    const language = localStorage.getItem("queenTransLanguage") || "id";
    if (language === "en") return english;
    if (language === "zh-CN") return chinese;
    return indonesian;
  }

  function setupMobileNavigation() {
    const toggle = document.querySelector(".mobile-toggle");
    const nav = document.querySelector("header nav");
    if (!toggle || !nav) return;

    if (!nav.id) nav.id = "mobileNavigation";
    nav.classList.add("qt-mobile-nav");
    nav.setAttribute("aria-label", "Navigasi utama");
    nav.querySelector("a.active")?.setAttribute("aria-current", "page");
    toggle.classList.add("qt-mobile-toggle");
    toggle.removeAttribute("onclick");
    toggle.setAttribute("type", "button");
    toggle.setAttribute("aria-controls", nav.id);
    toggle.setAttribute("aria-label", qt("Buka menu navigasi"));
    toggle.setAttribute("aria-expanded", "false");

    let menuScrollY = window.scrollY;
    const toggleIcon = toggle.querySelector("i");
    const closedIconClass = toggleIcon?.className || "fas fa-bars";
    const closeMobileMenu = function () {
      nav.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute(
        "aria-label",
        qt("Buka menu navigasi"),
      );
      if (toggleIcon) toggleIcon.className = closedIconClass;
      document.body.classList.remove("qt-nav-open");
    };

    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("active");
      if (open) menuScrollY = window.scrollY;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute(
        "aria-label",
        qt(open ? "Tutup menu navigasi" : "Buka menu navigasi"),
      );
      if (toggleIcon) {
        toggleIcon.className = open ? "fas fa-times" : closedIconClass;
      }
      document.body.classList.toggle("qt-nav-open", open);
    });

    // A menu left open while the page scrolls can cover the article cards.
    window.addEventListener("scroll", function () {
      if (Math.abs(window.scrollY - menuScrollY) > 2) closeMobileMenu();
    }, { passive: true });

    nav.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      closeMobileMenu();
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("active")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeMobileMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !nav.classList.contains("active")) return;
      closeMobileMenu();
      toggle.focus();
    });

    // Back/forward cache can restore an open menu and its overlay.
    window.addEventListener("pageshow", closeMobileMenu);

    const desktopNavigation = window.matchMedia("(min-width: 1025px)");
    const handleDesktopNavigation = function (event) {
      if (event.matches) closeMobileMenu();
    };
    if (desktopNavigation.addEventListener) {
      desktopNavigation.addEventListener("change", handleDesktopNavigation);
    } else {
      desktopNavigation.addListener(handleDesktopNavigation);
    }
  }

  function setupBlogFilters() {
    const search = document.querySelector("#blogSearch");
    const cards = Array.from(
      document.querySelectorAll(".blog-card[data-category]"),
    );
    if (!search || !cards.length) return;

    const buttons = Array.from(document.querySelectorAll(".blog-filter"));
    const clear = document.querySelector(".blog-search-clear");
    const summary = document.querySelector("#blogResultsSummary");
    const empty = document.querySelector("#blogEmpty");
    let category = "semua";

    function normalize(value) {
      return value.toLocaleLowerCase("id-ID").trim();
    }

    function filterCards() {
      const query = normalize(search.value);
      let visible = 0;

      cards.forEach(function (card) {
        const categoryMatch =
          category === "semua" || card.dataset.category === category;
        const searchableText = `${card.dataset.search || ""} ${card.textContent}`;
        const queryMatch = !query || normalize(searchableText).includes(query);
        const show = categoryMatch && queryMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (clear) clear.classList.toggle("is-visible", Boolean(search.value));
      if (summary)
        summary.textContent = qtf(
          visible + " artikel ditemukan",
          visible + " articles found",
          "找到 " + visible + " 篇文章",
        );
      if (empty) empty.classList.toggle("is-visible", visible === 0);
    }

    search.addEventListener("input", filterCards);
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        category = button.dataset.category;
        buttons.forEach(function (item) {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        filterCards();
      });
    });

    if (clear) {
      clear.addEventListener("click", function () {
        search.value = "";
        search.focus();
        filterCards();
      });
    }

    filterCards();
  }

  function slugify(text) {
    return text
      .toLocaleLowerCase("id-ID")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function setupArticleFeatures() {
    const article = document.querySelector("article");
    const content = document.querySelector(".article-content");
    if (!article || !content) return;

    const progress = document.createElement("div");
    progress.className = "reading-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.prepend(progress);

    function updateProgress() {
      const start = article.offsetTop;
      const distance = Math.max(article.offsetHeight - window.innerHeight, 1);
      const percentage = Math.min(
        100,
        Math.max(0, ((window.scrollY - start) / distance) * 100),
      );
      progress.style.width = percentage + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    const headings = Array.from(content.querySelectorAll("h2"));
    if (headings.length > 1 && !content.querySelector(".article-toc")) {
      const usedIds = new Set();
      headings.forEach(function (heading, index) {
        let id =
          heading.id || slugify(heading.textContent) || "bagian-" + (index + 1);
        const base = id;
        let suffix = 2;
        while (usedIds.has(id)) id = base + "-" + suffix++;
        usedIds.add(id);
        heading.id = id;
      });

      const toc = document.createElement("nav");
      toc.className = "article-toc";
      toc.setAttribute("aria-label", qt("Daftar isi artikel"));
      toc.innerHTML =
        "<h2>" +
        qt("Daftar Isi") +
        "</h2><ol>" +
        headings
          .map(function (heading) {
            return (
              '<li><a href="#' +
              heading.id +
              '">' +
              heading.textContent +
              "</a></li>"
            );
          })
          .join("") +
        "</ol>";
      content.insertBefore(toc, content.firstElementChild);
    }

    const title = document.querySelector(".article-header h1");
    const share = document.createElement("section");
    share.className = "article-share";
    share.setAttribute("aria-label", qt("Bagikan artikel"));
    const encodedUrl = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(
      title ? title.textContent : document.title,
    );
    share.innerHTML =
      "<strong>" +
      qt("Bagikan artikel") +
      "</strong>" +
      '<div class="article-share-actions">' +
      '<a class="share-whatsapp" href="https://wa.me/?text=' +
      encodedTitle +
      "%20" +
      encodedUrl +
      '" target="_blank" rel="noopener noreferrer" aria-label="' +
      qt("Bagikan artikel melalui WhatsApp") +
      '"><i class="fab fa-whatsapp"></i> WhatsApp</a>' +
      '<a class="share-facebook" href="https://www.facebook.com/sharer/sharer.php?u=' +
      encodedUrl +
      '" target="_blank" rel="noopener noreferrer" aria-label="' +
      qt("Bagikan artikel melalui Facebook") +
      '"><i class="fab fa-facebook-f"></i> Facebook</a>' +
      '<button class="share-instagram" type="button" aria-label="' +
      qt("Salin artikel dan buka Instagram") +
      '"><i class="fab fa-instagram"></i> Instagram</button>' +
      '<button class="share-copy" type="button"><i class="far fa-copy"></i> ' +
      qt("Salin tautan") +
      "</button>" +
      '</div><p class="share-status" role="status" aria-live="polite"></p>';
    content.appendChild(share);

    const copyButton = share.querySelector(".share-copy");
    const instagramButton = share.querySelector(".share-instagram");
    const shareStatus = share.querySelector(".share-status");

    async function copyText(text) {
      if (!navigator.clipboard || !window.isSecureContext) return false;
      await navigator.clipboard.writeText(text);
      return true;
    }

    copyButton.addEventListener("click", async function () {
      try {
        const copied = await copyText(window.location.href);
        if (!copied) throw new Error("Clipboard tidak tersedia");
        copyButton.innerHTML = '<i class="fas fa-check"></i> ' + qt("Tersalin");
        shareStatus.textContent = qt("Tautan artikel sudah disalin.");
      } catch (error) {
        window.prompt(qt("Salin tautan artikel:"), window.location.href);
      }
    });

    instagramButton.addEventListener("click", async function () {
      const caption =
        (title ? title.textContent : document.title) +
        "\n" +
        window.location.href;
      window.open(
        "https://www.instagram.com/",
        "_blank",
        "noopener,noreferrer",
      );
      try {
        const copied = await copyText(caption);
        if (!copied) throw new Error("Clipboard tidak tersedia");
        instagramButton.innerHTML =
          '<i class="fas fa-check"></i> ' + qt("Teks tersalin");
        shareStatus.textContent = qt(
          "Judul dan tautan sudah disalin. Tempelkan di Story, bio, atau pesan Instagram.",
        );
      } catch (error) {
        window.prompt(
          qt("Salin teks berikut, lalu bagikan melalui Instagram:"),
          caption,
        );
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNavigation();
    setupBlogFilters();
    setupArticleFeatures();
  });
})();
