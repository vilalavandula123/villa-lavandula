import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Страниците са генерирани предварително и не се обновяват при заявка — затова е достатъчен
// кеш само за четене от статичните файлове (без R2/KV, напълно в безплатния план).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
