/**
 * ============================================================
 * ADV SCALE - Scripts
 * Segurança, Menu Mobile, Contador, Animações, Formulário
 * ============================================================
 */

(function () {
  "use strict";

  // ============================================================
  // 1. SEGURANÇA - Bloquear ações de inspeção
  // ============================================================
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    return false;
  });

  document.addEventListener("keydown", function (e) {
    // F12
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+U
    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c")
    ) {
      e.preventDefault();
      return false;
    }
    if (e.ctrlKey && (e.key === "U" || e.key === "u")) {
      e.preventDefault();
      return false;
    }
    return true;
  });

  // ============================================================
  // 2. MENU HAMBÚRGUER
  // ============================================================
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
      }
    });

    // Fechar menu ao clicar em um link (mobile)
    const navLinks = mainNav.querySelectorAll(".header__nav-link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        const icon = menuToggle.querySelector("i");
        if (icon) {
          icon.className = "fas fa-bars";
        }
      });
    });

    // Fechar menu ao clicar fora (mobile)
    document.addEventListener("click", function (e) {
      if (window.innerWidth < 1024) {
        const header = document.querySelector(".header");
        if (header && !header.contains(e.target)) {
          mainNav.classList.remove("is-open");
          menuToggle.setAttribute("aria-expanded", "false");
          const icon = menuToggle.querySelector("i");
          if (icon) {
            icon.className = "fas fa-bars";
          }
        }
      }
    });
  }

  // ============================================================
  // 3. CONTADOR REGRESSIVO
  // ============================================================
  function initCountdown() {
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl) return;

    // Definir data do evento: 18 de setembro do ano atual ou próximo
    const now = new Date();
    let targetYear = now.getFullYear();
    const targetMonth = 8; // Setembro (0-based: 8 = Setembro)
    const targetDay = 18;

    let targetDate = new Date(targetYear, targetMonth, targetDay, 0, 0, 0);

    // Se já passou do dia 18 de setembro, usar o ano que vem
    if (now > targetDate) {
      targetDate = new Date(targetYear + 1, targetMonth, targetDay, 0, 0, 0);
    }

    function updateCountdown() {
      const current = new Date();
      let diff = targetDate - current;

      if (diff <= 0) {
        // Evento começou ou já passou
        daysEl.textContent = "00";
        hoursEl.textContent = "00";
        minutesEl.textContent = "00";
        secondsEl.textContent = "00";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);
      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);
      const seconds = Math.floor(diff / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  initCountdown();

  // ============================================================
  // 4. ANIMAÇÕES FADE-IN (Intersection Observer)
  // ============================================================
  function initFadeIn() {
    const fadeElements = document.querySelectorAll(".fade-in");

    if (!("IntersectionObserver" in window)) {
      // Fallback: exibir todos os elementos
      fadeElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Opcional: parar de observar após exibir
            // observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -20px 0px",
      },
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initFadeIn();

  // ============================================================
  // 5. FORMULÁRIO DE PRÉ-CADASTRO (validação front-end)
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

    function setError(input, errorEl, message) {
      input.classList.add("is-invalid");
      errorEl.textContent = message;
      input.setAttribute("aria-invalid", "true");
    }

    function clearError(input, errorEl) {
      input.classList.remove("is-invalid");
      errorEl.textContent = "";
      input.removeAttribute("aria-invalid");
    }

    function validateName() {
      const val = nameInput.value.trim();
      if (val.length < 3) {
        setError(
          nameInput,
          nameError,
          "Digite seu nome completo (mínimo 3 caracteres)",
        );
        return false;
      }
      clearError(nameInput, nameError);
      return true;
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(val)) {
        setError(
          emailInput,
          emailError,
          "Digite um e-mail válido (ex: nome@dominio.com)",
        );
        return false;
      }
      clearError(emailInput, emailError);
      return true;
    }

    function validatePhone() {
      const val = phoneInput.value.trim();
      // Aceita formatos: (00) 00000-0000 ou 00000000000
      const cleaned = val.replace(/\D/g, "");
      if (cleaned.length < 10 || cleaned.length > 11) {
        setError(
          phoneInput,
          phoneError,
          "Digite um telefone válido com DDD (ex: (11) 99999-9999)",
        );
        return false;
      }
      clearError(phoneInput, phoneError);
      return true;
    }

    function validateCity() {
      const val = cityInput.value.trim();
      if (val.length < 3) {
        setError(
          cityInput,
          cityError,
          "Digite sua cidade e UF (ex: São Paulo - SP)",
        );
        return false;
      }
      clearError(cityInput, cityError);
      return true;
    }

    // Validação em tempo real (ao perder o foco)
    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    phoneInput.addEventListener("blur", validatePhone);
    cityInput.addEventListener("blur", validateCity);

    // Máscara simples para telefone (durante digitação)
    phoneInput.addEventListener("input", function () {
      let val = this.value.replace(/\D/g, "");
      if (val.length > 11) val = val.slice(0, 11);
      let formatted = "";
      if (val.length > 0) {
        formatted = "(" + val.slice(0, 2);
        if (val.length > 2) {
          formatted += ") " + val.slice(2, 7);
          if (val.length > 7) {
            formatted += "-" + val.slice(7, 11);
          }
        }
      }
      this.value = formatted;
    });

    // Envio do formulário
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isCityValid = validateCity();

      if (isNameValid && isEmailValid && isPhoneValid && isCityValid) {
        // Simular envio com sucesso
        successMsg.style.display = "block";
        form.querySelector(".form__submit").disabled = true;
        form.querySelector(".form__submit").innerHTML =
          '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';

        setTimeout(function () {
          form.querySelector(".form__submit").disabled = false;
          form.querySelector(".form__submit").innerHTML =
            '<i class="fas fa-paper-plane" aria-hidden="true"></i> Garantir Minha Vaga Agora';
          // Resetar campos (opcional)
          // form.reset();
          // Para manter a mensagem de sucesso, não resetamos
          // Apenas desabilitamos os campos
          form.querySelectorAll(".form__input").forEach(function (input) {
            input.disabled = true;
          });
        }, 1200);
      } else {
        // Focar no primeiro campo com erro
        const firstInvalid = form.querySelector(".form__input.is-invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    });
  }

  // ============================================================
  // 6. SCROLL SUAVE PARA LINKS ÂNCORA (garantia extra)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset =
          parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--header-height")
              .replace("px", ""),
          ) || 84;
        const targetPosition =
          targetEl.getBoundingClientRect().top +
          window.pageYOffset -
          headerOffset -
          12;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================================================
  // 7. PROTEÇÃO EXTRA PARA LINKS DE CONVERSÃO
  // ============================================================
  // Os links já estão hardcoded no HTML com o URL correto.
  // Esta função bloqueia qualquer tentativa de alteração via console
  // (medida básica de segurança)
  Object.defineProperty(window, "ADV_SCALE_LINK", {
    value: "https://pay.kiwify.com.br/mDGPSbT",
    writable: false,
    configurable: false,
    enumerable: true,
  });

  // Verifica se todos os botões CTA apontam para o link correto
  document
    .querySelectorAll(
      ".hero__cta, .cta-final__btn, .floating-cta__link, .header__nav-link--cta",
    )
    .forEach(function (btn) {
      if (btn.tagName === "A") {
        const currentHref = btn.getAttribute("href");
        if (currentHref && !currentHref.includes("pay.kiwify.com.br/mDGPSbT")) {
          // Se por algum motivo o link foi alterado, corrige
          btn.setAttribute("href", "https://pay.kiwify.com.br/mDGPSbT");
        }
      }
    });

  console.log("ADV Scale - Landing Page carregada com sucesso!");
})();
