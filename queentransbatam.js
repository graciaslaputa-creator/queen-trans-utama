function queenTransText(indonesian, english, chinese) {
  const language = localStorage.getItem("queenTransLanguage") || "id";
  if (language === "en") return english;
  if (language === "zh-CN") return chinese;
  return indonesian;
}

function queenTransTranslate(value) {
  return window.QueenTransI18n ? window.QueenTransI18n.t(value) : value;
}

function initializeQueenTrans() {
  // =========================================
  // 1. MOBILE NAVIGATION
  // =========================================
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const mobileNav = navMenu?.closest("nav");
  const header = document.getElementById("header");

  if (mobileToggle && navMenu) {
    mobileNav?.classList.add("qt-mobile-nav");
    mobileNav?.setAttribute("aria-label", "Navigasi utama");
    navMenu
      .querySelector("a.active")
      ?.setAttribute("aria-current", "page");
    mobileToggle.classList.add("qt-mobile-toggle");
    mobileToggle.setAttribute("type", "button");
    mobileToggle.setAttribute("aria-controls", navMenu.id);
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileToggle.setAttribute(
      "aria-label",
      queenTransTranslate("Buka menu navigasi"),
    );

    const toggleIcon = mobileToggle.querySelector("i");
    const closedIconClass = toggleIcon?.className || "bi bi-list";
    const openIconClass = closedIconClass.includes("fa-")
      ? "fas fa-times"
      : "bi bi-x-lg";

    const closeMobileMenu = () => {
      navMenu.classList.remove("active");
      mobileNav?.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute(
        "aria-label",
        queenTransTranslate("Buka menu navigasi"),
      );
      if (toggleIcon) toggleIcon.className = closedIconClass;
      document.body.classList.remove("qt-nav-open");
    };

    mobileToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      navMenu.classList.toggle("active");
      const open = navMenu.classList.contains("active");
      mobileNav?.classList.toggle("active", open);
      mobileToggle.setAttribute("aria-expanded", String(open));
      mobileToggle.setAttribute(
        "aria-label",
        queenTransTranslate(
          open ? "Tutup menu navigasi" : "Buka menu navigasi",
        ),
      );
      if (toggleIcon) {
        toggleIcon.className = open ? openIconClass : closedIconClass;
      }
      document.body.classList.toggle("qt-nav-open", open);
    });

    document.addEventListener("click", (event) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMobileMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("active")) {
        closeMobileMenu();
        mobileToggle.focus();
      }
    });

    // Back/forward cache can restore an open menu and its overlay.
    window.addEventListener("pageshow", closeMobileMenu);

    const desktopNavigation = window.matchMedia("(min-width: 1025px)");
    const handleDesktopNavigation = (event) => {
      if (event.matches) closeMobileMenu();
    };
    if (desktopNavigation.addEventListener) {
      desktopNavigation.addEventListener("change", handleDesktopNavigation);
    } else {
      desktopNavigation.addListener(handleDesktopNavigation);
    }
  }

  // =========================================
  // 2. DOCUMENTATION GALLERY PREVIEW
  // =========================================
  const documentationGrid = document.getElementById("documentationGrid");
  const documentationToggle = document.getElementById("documentationToggle");

  if (documentationGrid && documentationToggle) {
    const documentationCards = Array.from(
      documentationGrid.querySelectorAll(".real-experience-card"),
    );
    const documentationMedia = window.matchMedia("(max-width: 768px)");
    const documentationLabel = documentationToggle.querySelector("span");
    const documentationIcon = documentationToggle.querySelector("i");
    let documentationExpanded = false;

    const renderDocumentation = () => {
      const previewLimit = documentationMedia.matches ? 4 : 6;
      documentationCards.forEach((card, index) => {
        card.hidden = !documentationExpanded && index >= previewLimit;
      });
      documentationToggle.hidden = documentationCards.length <= previewLimit;
      documentationToggle.setAttribute(
        "aria-expanded",
        String(documentationExpanded),
      );
      if (documentationLabel) {
        documentationLabel.textContent = queenTransText(
          documentationExpanded
            ? "Tampilkan Lebih Sedikit"
            : "Lihat Semua Dokumentasi",
          documentationExpanded ? "Show Less" : "View All Documentation",
          documentationExpanded ? "收起内容" : "查看全部记录",
        );
      }
      if (documentationIcon) {
        documentationIcon.className = documentationExpanded
          ? "fas fa-chevron-up"
          : "fas fa-chevron-down";
      }
    };

    documentationToggle.addEventListener("click", () => {
      documentationExpanded = !documentationExpanded;
      renderDocumentation();
      if (!documentationExpanded) {
        document
          .getElementById("documentation")
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "start",
          });
      }
    });

    if (documentationMedia.addEventListener) {
      documentationMedia.addEventListener("change", renderDocumentation);
    } else {
      documentationMedia.addListener(renderDocumentation);
    }
    renderDocumentation();
  }

  // =========================================
  // 3. HEADER SCROLL EFFECT
  // =========================================
  window.addEventListener("scroll", () => {
    if (header) {
      window.scrollY > 50
        ? header.classList.add("scrolled")
        : header.classList.remove("scrolled");
    }
  });

  // =========================================
  // 4. FILTER MOBIL
  // =========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const carCards = Array.from(document.querySelectorAll(".car-card"));
  const fleetToggle = document.getElementById("fleetToggle");
  const fleetMore = document.getElementById("fleetMore");
  const fleetPreviewSummary = document.getElementById("fleetPreviewSummary");
  const fleetMobileMedia = window.matchMedia("(max-width: 768px)");
  let activeFleetFilter = "all";
  let isFleetExpanded = false;

  function renderFleet() {
    const fleetPreviewLimit = fleetMobileMedia.matches ? 3 : 6;
    const matchingCards = carCards.filter((card) => {
      const categories = card.getAttribute("data-category").split(" ");
      return (
        activeFleetFilter === "all" || categories.includes(activeFleetFilter)
      );
    });

    matchingCards.forEach((card, index) => {
      const shouldShow = isFleetExpanded || index < fleetPreviewLimit;
      card.style.display = shouldShow ? "flex" : "none";
    });

    carCards
      .filter((card) => !matchingCards.includes(card))
      .forEach((card) => {
        card.style.display = "none";
      });

    const visibleCount = isFleetExpanded
      ? matchingCards.length
      : Math.min(fleetPreviewLimit, matchingCards.length);

    if (fleetPreviewSummary) {
      fleetPreviewSummary.textContent = queenTransText(
        `Menampilkan ${visibleCount} dari ${matchingCards.length} armada.`,
        `Showing ${visibleCount} of ${matchingCards.length} vehicles.`,
        `正在显示 ${matchingCards.length} 辆车中的 ${visibleCount} 辆。`,
      );
    }

    if (fleetMore) {
      fleetMore.hidden = matchingCards.length <= fleetPreviewLimit;
    }

    if (fleetToggle) {
      fleetToggle.setAttribute("aria-expanded", String(isFleetExpanded));
      const label = fleetToggle.querySelector("span");
      if (label)
        label.textContent = queenTransTranslate(
          isFleetExpanded ? "Tampilkan Lebih Sedikit" : "Lihat Semua Armada",
        );
    }
  }

  if (filterButtons.length > 0 && carCards.length > 0) {
    filterButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active")),
      );
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        });
        button.classList.add("active");
        button.setAttribute("aria-pressed", "true");
        activeFleetFilter = button.getAttribute("data-filter");
        isFleetExpanded = false;
        renderFleet();
      });
    });

    if (fleetToggle) {
      fleetToggle.addEventListener("click", () => {
        isFleetExpanded = !isFleetExpanded;
        renderFleet();
      });
    }

    fleetMobileMedia.addEventListener("change", () => {
      if (!isFleetExpanded) renderFleet();
    });

    renderFleet();
  }

  // =========================================
  // 4. VALIDASI TANGGAL (PENTING AGAR TIDAK ERROR)
  // =========================================
  const pickupInput = document.getElementById("pickupDate");
  const returnInput = document.getElementById("returnDate");

  if (pickupInput && returnInput) {
    // Ambil tanggal hari ini dalam format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Set minimal tanggal adalah hari ini (User gabisa pilih tanggal lampau)
    pickupInput.setAttribute("min", today);
    returnInput.setAttribute("min", today);

    // Jika tanggal ambil diubah, tanggal kembali minimal harus sama dengan tanggal ambil
    pickupInput.addEventListener("change", function () {
      returnInput.setAttribute("min", this.value);
      // Optional: Reset tanggal kembali jika lebih kecil dari tanggal ambil baru
      if (returnInput.value && returnInput.value < this.value) {
        returnInput.value = this.value;
      }
    });
  }

  // =========================================
  // 5. BOOKING LANGSUNG KE WHATSAPP (TANPA BACKEND)
  // =========================================
  const rentalForm = document.getElementById("rentalForm");
  if (rentalForm) {
    rentalForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!rentalForm.checkValidity()) {
        rentalForm.reportValidity();
        return;
      }

      const selectedService = rentalForm.querySelector(
        'input[name="serviceType"]:checked',
      );
      const notes = document.getElementById("notes").value.trim() || "-";
      const message = [
        queenTransText(
          "Halo Queen Trans Batam, saya ingin memesan kendaraan.",
          "Hello Queen Trans Batam, I would like to book a vehicle.",
          "您好 Queen Trans Batam，我想预订车辆。",
        ),
        "",
        `*${queenTransTranslate("Detail Pemesanan")}*`,
        `${queenTransText("Nama", "Name", "姓名")}: ${document.getElementById("name").value.trim()}`,
        `${queenTransText("Nomor WhatsApp", "WhatsApp Number", "WhatsApp 号码")}: ${document.getElementById("phone").value.trim()}`,
        `Email: ${document.getElementById("email").value.trim()}`,
        `${queenTransText("Layanan", "Service", "服务")}: ${queenTransTranslate(selectedService.value)}`,
        `${queenTransText("Mobil", "Vehicle", "车辆")}: ${document.getElementById("carType").value}`,
        `${queenTransText("Tanggal ambil", "Pickup date", "取车日期")}: ${document.getElementById("pickupDate").value}`,
        `${queenTransText("Tanggal kembali", "Return date", "还车日期")}: ${document.getElementById("returnDate").value}`,
        `${queenTransText("Lokasi penjemputan", "Pickup location", "取车地点")}: ${document.getElementById("pickupLocation").value.trim()}`,
        `${queenTransText("Catatan", "Notes", "备注")}: ${notes}`,
        "",
        queenTransTranslate(
          "Mohon konfirmasi ketersediaan dan harganya. Terima kasih.",
        ),
      ].join("\n");
      const whatsappUrl = `https://wa.me/6287791918354?text=${encodeURIComponent(message)}`;
      const whatsappWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer",
      );

      if (!whatsappWindow) {
        window.location.href = whatsappUrl;
        return;
      }

      const modal = document.getElementById("successModal");
      if (modal) modal.classList.add("active");
      rentalForm.reset();
    });
  }

  // =========================================
  // 6. MODAL & UI LAINNYA
  // =========================================
  window.closeDetailModal = function () {
    document.getElementById("carDetailModal").classList.remove("active");
    document.body.style.overflow = "";
  };
  window.closeSuccessModal = function () {
    document.getElementById("successModal").classList.remove("active");
    document.body.style.overflow = "";
  };

  // Tombol Detail Mobil
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const card = this.closest(".car-card");
      const carName = this.getAttribute("data-car");

      // Safety check jika gambar tidak ada
      const imgElement = card.querySelector(".car-image img");
      const carImage = imgElement ? imgElement.src : "";

      const yearText = card.dataset.year || queenTransTranslate("Konfirmasi tahun");
      const seatSpec = card.querySelector('[data-spec="seats"] span');
      const transmissionSpec = card.querySelector('[data-spec="transmission"] span');
      const fuelSpec = card.querySelector('[data-spec="fuel"] span');

      // Populate Modal Data
      document.getElementById("detailCarName").innerText = carName;
      document.getElementById("detailCarImage").src = carImage;

      if (document.getElementById("detailYear"))
        document.getElementById("detailYear").innerText = yearText;
      if (seatSpec && document.getElementById("detailSeats"))
        document.getElementById("detailSeats").innerText = seatSpec.innerText;
      if (transmissionSpec && document.getElementById("detailTrans"))
        document.getElementById("detailTrans").innerText = transmissionSpec.innerText;
      if (fuelSpec && document.getElementById("detailFuel"))
        document.getElementById("detailFuel").innerText = fuelSpec.innerText;

      document.getElementById("carDetailModal").classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Klik Gambar Mobil -> Buka Detail
  document.querySelectorAll(".car-image").forEach((imgWrapper) => {
    imgWrapper.style.cursor = "pointer";
    imgWrapper.addEventListener("click", function () {
      const card = this.closest(".car-card");
      if (card) {
        const detailBtn = card.querySelector(".btn-detail");
        if (detailBtn) detailBtn.click();
      }
    });
  });
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", initializeQueenTrans, {
    once: true,
  });
else initializeQueenTrans();
