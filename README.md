# Maxcel Services — website

Static, five-page marketing site for Maxcel Services. Vanilla HTML, CSS and JavaScript —
no build step, no dependencies. Open `index.html` or serve the directory with any static host.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero + quote capture, how we work, reviews policy, top FAQs, closing CTA |
| `services.html` | Quoting, scheduling, repeat work and larger projects |
| `reviews.html` | Reviews/references policy and the review submission form |
| `faq.html` | Full FAQ (with `FAQPage` structured data) |
| `contact.html` | Contact details and the full quote request form |

## Contact details used throughout

- Phone (primary call to action, `tel:` linked in the header, body and mobile call bar): **(703) 629-6602** / `+17036296602`
- Email: **ken@maxcelservices.com**

## Forms

All three forms (two quote requests, one review) post to LeadrVision:

```
<form method="POST" action="https://vision.leadrai.com/api/forms/9514c289e4f83cdfdb13f9842e59781e">
```

Each form includes:

- `_form` — a short human name for the form (`Quote request`, `Review`)
- `_page` — set to `window.location.href` on load, and included in JSON fetch bodies
- `_gotcha` — hidden honeypot field
- human-readable `name` attributes, using exactly `name`, `email` and `phone` where applicable

`assets/site.js` progressively enhances submission with `fetch()` to the same action URL and shows an
inline confirmation on `{"ok": true}`. With JavaScript disabled the plain POST still works; the
visitor returns with `?submitted=1` and the same confirmation is shown.

## Structure

```
index.html  services.html  reviews.html  faq.html  contact.html
assets/styles.css   assets/site.js   assets/favicon.svg
robots.txt
```

## Notes on content

Copy describes only what was supplied for this business: the name, phone number and email, plus the
way enquiries are handled. No testimonials, ratings, statistics, certifications or service-area
claims have been invented — the reviews page explains that real feedback is published only once it
is received.
