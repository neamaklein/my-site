import { bindings, defineConfig } from "cf/config";

// Where the contact form's messages go. Must be a verified Email Routing
// destination address in the Cloudflare account (sending there is free).
const CONTACT_TO = "neama.klein@gmail.com";

export default defineConfig({
  worker: {
    "name": "neama-klein-portfolio",
    "entrypoint": "./worker/index.js",
    "domains": ["neama.design", "www.neama.design"],
    "workersDev": true,
    "compatibilityDate": "2026-10-19",
    "observability": {
      "enabled": true
    },
    "assets": {
      "notFoundHandling": "single-page-application",
      "runWorkerFirst": ["/api/*"]
    },
    "env": {
      "EMAIL": bindings.sendEmail({ destinationAddress: CONTACT_TO, allowedSenderAddresses: ["contact@neama.design"] }),
      "CONTACT_TO": bindings.text(CONTACT_TO),
      "TURNSTILE_SECRET": bindings.secret()
    }
  }
});
