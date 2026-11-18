/* Maxcel Services — site behaviour
   - mobile navigation toggle
   - hidden _page field set to the current URL on load
   - progressive-enhancement form submit via fetch() to the same action URL
   - "Thanks, your message was sent" confirmation for ?submitted=1 and fetch replies
   Every form still works with JavaScript disabled (plain POST to the action URL).
*/
(function () {
  "use strict";

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------------- Forms ---------------- */
  var forms = document.querySelectorAll("form[data-leadr]");
  var submittedParam = false;

  try {
    submittedParam = new URLSearchParams(window.location.search).get("submitted") === "1";
  } catch (err) {
    submittedParam = window.location.search.indexOf("submitted=1") > -1;
  }

  function statusFor(form) {
    var id = form.getAttribute("data-status");
    return id ? document.getElementById(id) : null;
  }

  function showSuccess(form, scroll) {
    var box = statusFor(form);
    if (!box) { return; }
    box.classList.remove("form-status--error");
    box.innerHTML =
      "<strong>Thanks, your message was sent.</strong>" +
      "We’ll get back to you by phone or email. Need to talk sooner? Call " +
      '<a href="tel:+17036296602">(703) 629-6602</a>.';
    box.classList.add("is-visible");
    if (scroll) {
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    box.setAttribute("tabindex", "-1");
    box.focus({ preventScroll: true });
  }

  function showError(form) {
    var box = statusFor(form);
    if (!box) { return; }
    box.classList.add("form-status--error");
    box.innerHTML =
      "<strong>That didn’t go through.</strong>" +
      'Please try again, or call <a href="tel:+17036296602">(703) 629-6602</a> ' +
      'or email <a href="mailto:ken@maxcelservices.com">ken@maxcelservices.com</a>.';
    box.classList.add("is-visible");
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  Array.prototype.forEach.call(forms, function (form) {
    /* Keep the hidden _page field pointing at this page so visitors come back here. */
    var pageField = form.querySelector('input[name="_page"]');
    if (pageField) {
      pageField.value = window.location.href;
    }

    /* Plain (no-JS-needed) submission already happened: show the confirmation. */
    if (submittedParam) {
      showSuccess(form, false);
    }

    form.addEventListener("submit", function (event) {
      if (typeof window.fetch !== "function" || typeof FormData !== "function") {
        return; /* fall back to the normal POST */
      }

      event.preventDefault();

      if (pageField) {
        pageField.value = window.location.href;
      }

      var button = form.querySelector('button[type="submit"]');
      var originalLabel = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      var data = new FormData(form);
      var payload = {};
      data.forEach(function (value, key) {
        payload[key] = typeof value === "string" ? value : String(value);
      });
      payload._page = window.location.href;

      fetch(form.getAttribute("action"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          return response
            .json()
            .catch(function () { return { ok: response.ok }; })
            .then(function (body) {
              if (response.ok && body && body.ok !== false) {
                form.reset();
                if (pageField) { pageField.value = window.location.href; }
                showSuccess(form, true);
              } else {
                showError(form);
              }
            });
        })
        .catch(function () {
          showError(form);
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        });
    });
  });

  /* Current year in the footer. */
  var year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
