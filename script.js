/**
 * ============================================================
 * ADV SCALE — Scripts
 * Menu mobile, contador, animações, formulário + Google Sheets,
 * scroll suave e proteção de links.
 * ============================================================
 */

(function () {
  "use strict";

  // ============================================================
  // 1. SEGURANÇA — bloquear inspeção
  // Aviso: isto não impede alguém com conhecimento técnico de ver
  // o código (View Source, DevTools remoto, etc.) — é dissuasão
  // básica, não proteção real. Mantido porque já fazia parte do
  // seu build. Pode remover este bloco sem afetar nada mais.
  // ============================================================
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "F12") {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && e.shiftKey && ["I", "i", "C", "c"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
      e.preventDefault();
    }
  });

  // ============================================================
  // 2. MENU MOBILE
  // ============================================================
  const menuToggle = document.getElementById("menuToggle");
  const mainNavMobile = document.getElementById("mainNavMobile");

  if (menuToggle && mainNavMobile) {
    const closeMenu = function () {
      mainNavMobile.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      const icon = menuToggle.querySelector("i");
      if (icon) icon.className = "fa-solid fa-bars text-lg";
    };

    menuToggle.addEventListener("click", function () {
      const isOpen = mainNavMobile.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const icon = menuToggle.querySelector("i");
      if (icon)
        icon.className = isOpen
          ? "fa-solid fa-xmark text-lg"
          : "fa-solid fa-bars text-lg";
    });

    mainNavMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (e) {
      if (window.innerWidth < 1024) {
        const header = document.querySelector(".header");
        if (header && !header.contains(e.target)) closeMenu();
      }
    });
  }

  // ============================================================
  // 3. CONTADOR REGRESSIVO — alvo: 18 de setembro
  // ============================================================
  function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    if (!daysEl) return;

    const now = new Date();
    const targetMonth = 8; // setembro (0-indexed)
    const targetDay = 18;
    let targetDate = new Date(
      now.getFullYear(),
      targetMonth,
      targetDay,
      0,
      0,
      0,
    );
    if (now > targetDate) {
      targetDate = new Date(
        now.getFullYear() + 1,
        targetMonth,
        targetDay,
        0,
        0,
        0,
      );
    }

    function update() {
      let diff = targetDate - new Date();
      if (diff <= 0) {
        [daysEl, hoursEl, minutesEl, secondsEl].forEach(
          (el) => (el.textContent = "00"),
        );
        return;
      }
      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const minutes = Math.floor(diff / 60000);
      diff -= minutes * 60000;
      const seconds = Math.floor(diff / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }
  initCountdown();

  // ============================================================
  // 4. FADE-IN (Intersection Observer)
  // ============================================================
  function initFadeIn() {
    const items = document.querySelectorAll(".fade-in");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" },
    );
    items.forEach((el) => observer.observe(el));
  }
  initFadeIn();

  // ============================================================
  // 5. FORMULÁRIO — VALIDAÇÃO + GOOGLE SHEETS + REDIRECT
  // ============================================================
  const form = document.getElementById("preRegisterForm");
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const cityInput = document.getElementById("city");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const cityError = document.getElementById("cityError");
    const successMsg = document.getElementById("formSuccess");
    const submitBtn = form.querySelector(".form__submit");

    // Troque pela URL do seu Apps Script publicado
    const GOOGLE_SHEETS_URL =
      "https://script.google.com/macros/s/AKfycbzTukETXDOv6vwiFX5TAQ4w1nRPCft53Etygw12ZBeQovgujgFDI6HXSsoWAT2jZ-hVbg/exec";
    const REDIRECT_URL = "https://pay.kiwify.com.br/mDGPSbT";

    function setError(input, el, msg) {
      input.classList.add("is-invalid");
      el.textContent = msg;
      input.setAttribute("aria-invalid", "true");
    }
    function clearError(input, el) {
      input.classList.remove("is-invalid");
      el.textContent = "";
      input.removeAttribute("aria-invalid");
    }

    function validateName() {
      const ok = nameInput.value.trim().length >= 3;
      ok
        ? clearError(nameInput, nameError)
        : setError(
            nameInput,
            nameError,
            "Digite seu nome completo (mínimo 3 caracteres)",
          );
      return ok;
    }
    function validateEmail() {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
      ok
        ? clearError(emailInput, emailError)
        : setError(emailInput, emailError, "Digite um e-mail válido");
      return ok;
    }
    function validatePhone() {
      const cleaned = phoneInput.value.replace(/\D/g, "");
      const ok = cleaned.length >= 10 && cleaned.length <= 11;
      ok
        ? clearError(phoneInput, phoneError)
        : setError(phoneInput, phoneError, "Digite um telefone válido com DDD");
      return ok;
    }
    function validateCity() {
      const ok = cityInput.value.trim().length >= 3;
      ok
        ? clearError(cityInput, cityError)
        : setError(cityInput, cityError, "Digite sua cidade e UF");
      return ok;
    }

    async function sendToGoogleSheets(data) {
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        return { success: true };
      } catch (err) {
        console.error("Erro ao enviar para o Google Sheets:", err);
        return { success: false };
      }
    }

    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    phoneInput.addEventListener("blur", validatePhone);
    cityInput.addEventListener("blur", validateCity);

    phoneInput.addEventListener("input", function () {
      let val = this.value.replace(/\D/g, "").slice(0, 11);
      let formatted = "";
      if (val.length > 0) {
        formatted = "(" + val.slice(0, 2);
        if (val.length > 2) {
          formatted += ") " + val.slice(2, 7);
          if (val.length > 7) formatted += "-" + val.slice(7, 11);
        }
      }
      this.value = formatted;
    });

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const valid = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validateCity(),
      ].every(Boolean);
      if (!valid) {
        const firstInvalid = form.querySelector(".form__input.is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        source: "ADV Scale Landing Page",
        event_date: "18 e 19 de setembro",
      };

      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';

      const result = await sendToGoogleSheets(formData);

      if (result.success) {
        successMsg.classList.remove("hidden");
        form
          .querySelectorAll(".form__input")
          .forEach((input) => (input.disabled = true));
        submitBtn.innerHTML =
          '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Enviado com sucesso!';
        setTimeout(() => {
          window.location.href = REDIRECT_URL;
        }, 2000);
      } else {
        submitBtn.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Erro. Tente novamente.';
        submitBtn.disabled = false;
      }
    });
  }

  // ============================================================
  // 6. SCROLL SUAVE (com desconto do header fixo)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const headerOffset = 76;
      const targetPosition =
        targetEl.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset -
        12;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });

  // ============================================================
  // 7. PROTEÇÃO DO LINK DE CHECKOUT
  // Garante que qualquer link marcado como CTA de pagamento
  // sempre aponte para o checkout oficial, mesmo se alguém
  // editar o href no HTML por engano.
  // ============================================================
  const CHECKOUT_URL = "https://pay.kiwify.com.br/mDGPSbT";
  document.querySelectorAll("[data-checkout-link]").forEach(function (link) {
    link.setAttribute("href", CHECKOUT_URL);
  });

  console.log("ADV Scale — Landing page carregada.");
})();
