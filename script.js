/**
 * ============================================================
 * ADV SCALE - Scripts
 * Segurança, Menu Mobile, Contador, Animações, Formulário, Carrossel
 * Integração com Google Sheets via Apps Script
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
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
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

    const now = new Date();
    let targetYear = now.getFullYear();
    const targetMonth = 8;
    const targetDay = 18;

    let targetDate = new Date(targetYear, targetMonth, targetDay, 0, 0, 0);

    if (now > targetDate) {
      targetDate = new Date(targetYear + 1, targetMonth, targetDay, 0, 0, 0);
    }

    function updateCountdown() {
      const current = new Date();
      let diff = targetDate - current;

      if (diff <= 0) {
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
  // 5. CARROSSEL AUTOMÁTICO
  // ============================================================
  function initCarousel() {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");
    const dotsContainer = document.getElementById("carouselDots");
    const progressBar = document.getElementById("carouselProgress");

    if (!track) return;

    const slides = track.querySelectorAll(".carousel__slide");
    const totalSlides = slides.length;
    let currentIndex = 0;
    let intervalId = null;
    const AUTOPLAY_INTERVAL = 4000;

    slides.forEach(function (_, index) {
      const dot = document.createElement("button");
      dot.classList.add("carousel__dot");
      if (index === 0) dot.classList.add("carousel__dot--active");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Ir para slide " + (index + 1));
      dot.dataset.index = index;
      dot.addEventListener("click", function () {
        goTo(index);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".carousel__dot");

    function updateCarousel() {
      const slideWidth = slides[0].offsetWidth;
      track.style.transform =
        "translateX(-" + currentIndex * slideWidth + "px)";

      dots.forEach(function (dot, index) {
        dot.classList.toggle("carousel__dot--active", index === currentIndex);
      });

      const progress = ((currentIndex + 1) / totalSlides) * 100;
      progressBar.style.width = progress + "%";

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalSlides - 1;
    }

    function goTo(index) {
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;
      currentIndex = index;
      updateCarousel();
    }

    function nextSlide() {
      if (currentIndex < totalSlides - 1) {
        goTo(currentIndex + 1);
      } else {
        goTo(0);
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        goTo(currentIndex - 1);
      } else {
        goTo(totalSlides - 1);
      }
    }

    function resetAutoplay() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      startAutoplay();
    }

    function startAutoplay() {
      if (intervalId) return;
      intervalId = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    prevBtn.addEventListener("click", function () {
      prevSlide();
      resetAutoplay();
    });

    nextBtn.addEventListener("click", function () {
      nextSlide();
      resetAutoplay();
    });

    const carousel = document.getElementById("carousel");
    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("touchstart", stopAutoplay);
    carousel.addEventListener("touchend", startAutoplay);

    let resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        updateCarousel();
      }, 250);
    });

    updateCarousel();
    startAutoplay();

    carousel.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
        resetAutoplay();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
        resetAutoplay();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
  } else {
    initCarousel();
  }

  // ============================================================
  // 6. FORMULÁRIO DE PRÉ-CADASTRO - GOOGLE SHEETS
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

    // ============================================================
    // CONFIGURAÇÃO DO GOOGLE SHEETS - URL FORNECIDO POR VOCÊ
    // ============================================================
    const GOOGLE_SHEETS_URL =
      "https://script.google.com/macros/s/AKfycbzTukETXDOv6vwiFX5TAQ4w1nRPCft53Etygw12ZBeQovgujgFDI6HXSsoWAT2jZ-hVbg/exec";
    const REDIRECT_URL = "https://pay.kiwify.com.br/mDGPSbT";

    // ============================================================
    // FUNÇÕES DE VALIDAÇÃO
    // ============================================================
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

    // ============================================================
    // FUNÇÃO DE ENVIO PARA O GOOGLE SHEETS
    // ============================================================
    async function sendToGoogleSheets(data) {
      try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // Com no-cors, a resposta não é acessível, mas se não houve erro de rede,
        // o envio foi bem-sucedido
        return { success: true, message: "Dados enviados com sucesso!" };
      } catch (error) {
        console.error("Erro ao enviar para o Google Sheets:", error);
        return {
          success: false,
          message: "Erro ao enviar dados. Tente novamente.",
        };
      }
    }

    // ============================================================
    // EVENTOS DE VALIDAÇÃO EM TEMPO REAL
    // ============================================================
    nameInput.addEventListener("blur", validateName);
    emailInput.addEventListener("blur", validateEmail);
    phoneInput.addEventListener("blur", validatePhone);
    cityInput.addEventListener("blur", validateCity);

    // Máscara de telefone
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

    // ============================================================
    // SUBMIT DO FORMULÁRIO
    // ============================================================
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Validar todos os campos
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isPhoneValid = validatePhone();
      const isCityValid = validateCity();

      if (!isNameValid || !isEmailValid || !isPhoneValid || !isCityValid) {
        const firstInvalid = form.querySelector(".form__input.is-invalid");
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Preparar dados para envio
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        source: "ADV Scale Landing Page",
        event_date: "18 e 19 de setembro",
      };

      // Desabilitar botão e mostrar loading
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Enviando...';

      try {
        // Enviar dados para o Google Sheets
        const result = await sendToGoogleSheets(formData);

        if (result.success !== false) {
          // Sucesso!
          successMsg.style.display = "block";
          form.querySelectorAll(".form__input").forEach(function (input) {
            input.disabled = true;
          });
          submitBtn.innerHTML =
            '<i class="fas fa-check-circle" aria-hidden="true"></i> Enviado com Sucesso!';

          // Redirecionar após 2 segundos
          setTimeout(function () {
            window.location.href = REDIRECT_URL;
          }, 2000);
        } else {
          // Erro no envio
          submitBtn.innerHTML =
            '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Erro. Tente novamente.';
          submitBtn.disabled = false;
          console.error("Erro no envio:", result);
        }
      } catch (error) {
        // Erro de rede ou outro
        submitBtn.innerHTML =
          '<i class="fas fa-exclamation-circle" aria-hidden="true"></i> Erro. Tente novamente.';
        submitBtn.disabled = false;
        console.error("Erro no envio:", error);
      }
    });
  }

  // ============================================================
  // 7. SCROLL SUAVE PARA LINKS ÂNCORA
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
  // 8. PROTEÇÃO EXTRA PARA LINKS DE CONVERSÃO
  // ============================================================
  Object.defineProperty(window, "ADV_SCALE_LINK", {
    value: "https://pay.kiwify.com.br/mDGPSbT",
    writable: false,
    configurable: false,
    enumerable: true,
  });

  document
    .querySelectorAll(
      ".hero__cta, .cta-final__btn, .floating-cta__link, .header__nav-link--cta",
    )
    .forEach(function (btn) {
      if (btn.tagName === "A") {
        const currentHref = btn.getAttribute("href");
        if (currentHref && !currentHref.includes("pay.kiwify.com.br/mDGPSbT")) {
          btn.setAttribute("href", "https://pay.kiwify.com.br/mDGPSbT");
        }
      }
    });

  console.log("ADV Scale - Landing Page carregada com sucesso!");
  console.log("📊 Formulário integrado com Google Sheets");
})();
