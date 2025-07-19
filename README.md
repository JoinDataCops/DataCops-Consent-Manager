# 🚦 DataCops‑Consent‑Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TryDataCops/DataCops-Consent-Manager/ci.yml)](https://github.com/TryDataCops/DataCops-Consent-Manager/actions)
[![Coverage](https://img.shields.io/codecov/c/github/TryDataCops/DataCops-Consent-Manager)](https://codecov.io/gh/TryDataCops/DataCops-Consent-Manager)
[![Issues](https://img.shields.io/github/issues/TryDataCops/DataCops-Consent-Manager)](https://github.com/TryDataCops/DataCops-Consent-Manager/issues)
[![Last Commit](https://img.shields.io/github/last-commit/TryDataCops/DataCops-Consent-Manager)](https://github.com/TryDataCops/DataCops-Consent-Manager)

**DataCops‑Consent‑Manager** is a fully‑open‑source Consent Management Platform (CMP) designed for GDPR/CCPA compliance. It offers flexible deployment across web, native app, and server‑side environments, with robust integrations, scalability, and customization.

---

## ⚙️ Features

- **🧩 Multi‑Platform Support**
  - Web: JavaScript snippet and REST API  
  - Server‑Side: API-driven consent enforcement  

- **📚 Standards-Compliant**
  - IAB TCF v2, GPP, CCPA, LGPD  
  - Google Consent Mode v2  

- **🔧 Blocking & Handling**
  - Cookie/script blocking  
  - Automatic/manual enforcement  

- **🔒 API & Dashboard**
  - REST APIs for consent logs and management  
  - Admin dashboard for auditing and reporting  

- **🌐 Customization**
  - Themes, languages, CSS  
  - Custom HTML and cookie-free options  

- **📈 Analytics & A/B Testing**
  - Consent analytics  
  - A/B test experiences  

- **🔗 Third‑Party Integrations**
  - Supports Google Analytics, Hotjar, Facebook Pixel, Matomo  
  - Works with iOS/Android attribution SDKs  

---

## 📦 Installation

### Web

```html
<script src="https://cdn.datacops.io/consent.js"></script>
<script>
  DataCops.init({
    codeId: "YOUR_CODE_ID",
    domain: "consent.datacops.io",
    language: "en",
    cookieFree: false
  })
</script>
```

### Server

```bash
npm install @datacops/consent-api
```

```js
import { ConsentAPI } from '@datacops/consent-api'

const client = new ConsentAPI({ apiKey: process.env.CONSENT_API_KEY })

await client.recordConsent(userId, { purposes: ["analytics", "ads"] })
```

---

## 🧭 Usage Guide

1. Configure vendors, cookie categories, and purposes.
2. Embed snippet or SDK.
3. Block scripts/cookies until consent.
4. Analyze logs and optimize experience.

---

## 🔍 API Reference

- `GET /consents`, `POST /consents`
- `GET /vendors`, `PUT /vendors/:id`
- `GET /logs`
- Full spec: [OpenAPI Docs](https://consent.datacops.io/api/info)

---

## 🧪 Contributing

We welcome PRs!  

1. Fork  
2. Create branch  
3. Add tests/docs  
4. Ensure tests pass  
5. Open pull request  

See `CONTRIBUTING.md`.

---

## 🛡️ Security & Compliance

- GDPR/CCPA/LGPD-ready  
- Encrypted logs  
- Secure audit trails  

Report vulnerabilities via `SECURITY.md`.

---

## 📘 Documentation

- [Getting Started](docs/getting_started.md)  
- [Web Integration](docs/web_integration.md)  
- [Server API](docs/server_api.md)

---

## 🏷️ License

MIT © [DataCops](https://trydatacops.com)

---

## ⚙️ Roadmap

- Cross-domain consent sync  
- Cookie crawler  
- GraphQL support  

---

## 📬 Community

- [GitHub Issues](https://github.com/TryDataCops/DataCops-Consent-Manager/issues)  
- [Email Support](mailto:dev@trydatacops.com)