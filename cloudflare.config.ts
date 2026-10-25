import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    "name": "neama-klein-portfolio",
    "domains": ["neama.design", "www.neama.design"],
    "workersDev": true,
    "compatibilityDate": "2026-10-19",
    "observability": {
      "enabled": true
    },
    "assets": {
      "notFoundHandling": "single-page-application"
    }
  }
});
